// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, useWindowDimensions, Modal, Pressable, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../auth/AuthContext";
import { getProjects, changeProjectMode } from "../api/projects";
import { getSensors, Sensor, changeSensorSpeed, changeSensorTemperature, changeSensorStatus } from "../api/sensors";
import { getWeather, WeatherData } from "../api/weather";
import Logo from "../components/Logo";
import SensorCard from "../components/SensorCard";
import ModeIcon from "../components/ModeIcon";
import SpeedIndicator from "../components/SpeedIndicator";
import WeatherCard from "../components/WeatherCard";

const HomeScreen = () => {
  const { token, logout } = useAuth();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectMode, setProjectMode] = useState<string | null>(null);
  const [globalSpeed, setGlobalSpeed] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<number | null>(null);
  const [showModeModal, setShowModeModal] = useState(false);
  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const [showTemperatureModal, setShowTemperatureModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isDesktop = width >= 768;
  const numColumns = isDesktop ? (width >= 1200 ? 3 : 2) : 1;

  const loadWeather = async () => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const data = await getWeather();
      setWeather(data);
    } catch (e) {
      console.error("Error loading weather", e);
      setWeatherError("Unable to load weather");
    } finally {
      setWeatherLoading(false);
    }
  };

  const loadData = async (isRefresh = false) => {
    if (!token) return;
    
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    // Load weather in parallel
    loadWeather();
    
    try {
      const projects = await getProjects();
      const first = projects[0];
      if (!first) return;

      setProjectName(first.name || "");
      setProjectMode(first.topic?.mode || null);
      setLastSync(first.topic?.last_sync || null);
      setTopicId(first.topic?.id || null);

      const sensors = await getSensors(first.id);
      setSensors(sensors);
      // Speed is global, get it from the first sensor
      if (sensors.length > 0 && sensors[0].speed) {
        setGlobalSpeed(sensors[0].speed);
      }
    } catch (e) {
      console.error("Error loading sensors", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleModeChange = async (newMode: "1" | "2") => {
    if (!topicId) return;
    
    // Don't make API call if mode is already active
    if (projectMode === newMode) {
      setShowModeModal(false);
      return;
    }
    
    try {
      // API call to change mode
      await changeProjectMode(topicId, newMode);
      
      // Update local state
      setProjectMode(newMode);
      setShowModeModal(false);
    } catch (e) {
      console.error("Error changing project mode", e);
      // TODO: Display error message to user
    }
  };

  const handleSpeedChange = async (newSpeed: "1" | "2" | "3" | "4") => {
    // Use first sensor to change speed (applies to all)
    if (sensors.length === 0 || !sensors[0].id) return;
    
    // Don't make API call if speed is already active
    if (globalSpeed === newSpeed) {
      setShowSpeedModal(false);
      return;
    }
    
    try {
      // API call to change speed (on first sensor, but applies to all)
      await changeSensorSpeed(sensors[0].id, newSpeed);
      
      // Update local state
      setGlobalSpeed(newSpeed);
      setShowSpeedModal(false);
    } catch (e) {
      console.error("Error changing sensor speed", e);
      // TODO: Display error message to user
    }
  };

  const handleTemperaturePress = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setShowTemperatureModal(true);
  };

  const handleTemperatureChange = async (newTemperature: number) => {
    if (!selectedSensor || !selectedSensor.id) return;
    
    try {
      // API call to change temperature
      await changeSensorTemperature(selectedSensor.id, newTemperature);
      
      // Update local state
      setSensors((prevSensors) =>
        prevSensors.map((s) =>
          s.id === selectedSensor.id
            ? { ...s, setpoint_temperature: newTemperature }
            : s
        )
      );
      
      setShowTemperatureModal(false);
      setSelectedSensor(null);
    } catch (e) {
      console.error("Error changing sensor temperature", e);
      // TODO: Display error message to user
    }
  };

  const handleStatusPress = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setShowStatusModal(true);
  };

  const handleStatusChange = async (newStatus: "02" | "03") => {
    if (!selectedSensor || !selectedSensor.id) return;
    
    // Don't make API call if status is already active
    if (selectedSensor.status === newStatus) {
      setShowStatusModal(false);
      setSelectedSensor(null);
      return;
    }
    
    try {
      // API call to change status
      await changeSensorStatus(selectedSensor.id, newStatus);
      
      // Update local state
      setSensors((prevSensors) =>
        prevSensors.map((s) =>
          s.id === selectedSensor.id
            ? { ...s, status: newStatus }
            : s
        )
      );
      
      setShowStatusModal(false);
      setSelectedSensor(null);
    } catch (e) {
      console.error("Error changing sensor status", e);
      // TODO: Display error message to user
    }
  };

  const renderItem = ({ item }: { item: Sensor }) => {
    return (
      <SensorCard
        sensor={item}
        onTemperaturePress={handleTemperaturePress}
        onStatusPress={handleStatusPress}
      />
    );
  };

  return (
    <View className="flex-1 bg-slate-900">
      {/* Header moderne */}
      <View className="bg-slate-800 border-b border-slate-700/50 shadow-lg" style={{ paddingTop: insets.top }}>
        <View className={`px-5 pt-4 pb-4 ${isDesktop ? "max-w-[1400px] self-center w-full" : ""}`}>
          {/* Ligne principale : Logo + Titre + Bouton */}
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center gap-2.5">
              <View className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-md overflow-hidden">
                <Logo size={32} />
              </View>
              <View>
                <Text className="text-[28px] font-extrabold text-slate-50 tracking-tight">KoolControl</Text>
                {projectName && (
                  <View className="flex-row items-center gap-1.5 mt-0.5">
                    <View className="w-1 h-1 rounded-full bg-emerald-500"></View>
                    <Text className="text-[15px] text-slate-400 font-medium">{projectName}</Text>
                  </View>
                )}
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity 
                className="bg-slate-700 px-3 py-2.5 rounded-xl border border-slate-600 active:opacity-80 flex items-center justify-center"
                style={{ minWidth: 40, minHeight: 36 }}
                onPress={() => loadData(true)}
                disabled={refreshing}
              >
                {refreshing ? (
                  <ActivityIndicator size="small" color="#F1F5F9" />
                ) : (
                  <Text className="text-slate-50 text-xl leading-none" style={{ fontFamily: 'System' }}>↻</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-slate-700 px-4 py-2.5 rounded-xl border border-slate-600 active:opacity-80 flex items-center justify-center"
                onPress={logout}
              >
                <Text className="text-slate-50 text-sm font-semibold">Logout</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Secondary line: Mode + Speed */}
          {(projectMode || globalSpeed) && (
            <View className="flex-row items-center justify-between">
              {projectMode && (
                <TouchableOpacity
                  onPress={() => setShowModeModal(true)}
                  className={`px-3 py-1.5 rounded-full flex-row items-center gap-2 active:opacity-80 ${
                    projectMode === "1" ? "bg-blue-500/20" : "bg-orange-500/20"
                  }`}
                >
                  <ModeIcon mode={projectMode as "1" | "2"} size={18} />
                  <Text className={`text-sm font-semibold ${
                    projectMode === "1" ? "text-blue-400" : "text-orange-400"
                  }`}>
                    {projectMode === "1" ? "Cooling" : "Heating"}
                  </Text>
                </TouchableOpacity>
              )}
              {!projectMode && <View />}
              {globalSpeed && <SpeedIndicator speed={globalSpeed} onPress={() => setShowSpeedModal(true)} />}
            </View>
          )}
        </View>
      </View>

      <View className="flex-1">
        <View className={`flex-1 px-5 pt-4 ${isDesktop ? "max-w-[1400px] self-center w-full" : ""}`}>
          {loading ? (
            <View className="flex-1 justify-center items-center gap-3">
              <ActivityIndicator size="large" color="#60A5FA" />
              <Text className="text-slate-400 text-[17px] font-medium">Loading...</Text>
            </View>
          ) : (
            <FlatList
              data={sensors}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderItem}
              ListHeaderComponent={
                <WeatherCard
                  weather={weather}
                  loading={weatherLoading}
                  error={weatherError}
                />
              }
              contentContainerStyle={{
                paddingBottom: 24,
                ...(isDesktop && { paddingHorizontal: 0 }),
              }}
              showsVerticalScrollIndicator={false}
              numColumns={numColumns}
              columnWrapperStyle={isDesktop ? { justifyContent: "flex-start", paddingHorizontal: 0 } : undefined}
            />
          )}
        </View>

        {/* Footer with sync date */}
        <View className="bg-slate-800 border-t border-slate-700/50" style={{ paddingBottom: insets.bottom }}>
          <View className={`px-5 ${isDesktop ? "max-w-[1400px] self-center w-full" : ""}`} style={{ paddingVertical: 8 }}>
            <View className="flex-row items-center justify-center gap-2">
              <View className="w-1.5 h-1.5 rounded-full bg-slate-500"></View>
              <Text className="text-xs text-slate-400">
                {lastSync ? (
                  <>Last sync: {formatLastSync(lastSync)}</>
                ) : (
                  "No sync available"
                )}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Mode selection modal */}
      <Modal
        visible={showModeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModeModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setShowModeModal(false)}
        >
          <Pressable
            className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg w-[85%] max-w-sm"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-lg font-bold text-slate-50 mb-4 text-center">
              Choose mode
            </Text>
            
            <TouchableOpacity
              onPress={() => handleModeChange("1")}
              className={`mb-3 px-4 py-3 rounded-xl border flex-row items-center gap-3 ${
                projectMode === "1"
                  ? "bg-blue-500/20 border-blue-500/50"
                  : "bg-slate-700/50 border-slate-600"
              } active:opacity-80`}
            >
              <ModeIcon mode="1" size={24} />
                  <Text className={`text-base font-semibold flex-1 ${
                projectMode === "1" ? "text-blue-400" : "text-slate-300"
              }`}>
                Cooling
              </Text>
              {projectMode === "1" && (
                <View className="w-2 h-2 rounded-full bg-blue-400"></View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleModeChange("2")}
              className={`px-4 py-3 rounded-xl border flex-row items-center gap-3 ${
                projectMode === "2"
                  ? "bg-orange-500/20 border-orange-500/50"
                  : "bg-slate-700/50 border-slate-600"
              } active:opacity-80`}
            >
              <ModeIcon mode="2" size={24} />
                  <Text className={`text-base font-semibold flex-1 ${
                projectMode === "2" ? "text-orange-400" : "text-slate-300"
              }`}>
                Heating
              </Text>
              {projectMode === "2" && (
                <View className="w-2 h-2 rounded-full bg-orange-400"></View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowModeModal(false)}
              className="mt-4 pt-4 border-t border-slate-700"
            >
              <Text className="text-sm text-slate-400 text-center font-medium">
                Cancel
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Speed selection modal */}
      <Modal
        visible={showSpeedModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSpeedModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setShowSpeedModal(false)}
        >
          <Pressable
            className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg w-[85%] max-w-sm"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-lg font-bold text-slate-50 mb-4 text-center">
              Choose speed
            </Text>
            
            {(["1", "2", "3", "4"] as const).map((speedValue) => {
              const speedNum = parseInt(speedValue, 10);
              const isActive = globalSpeed === speedValue;
              const getSpeedLabel = (num: number) => {
                if (num === 1) return "Low";
                if (num === 2) return "Medium";
                if (num === 3) return "Fast";
                if (num === 4) return "Auto";
                return "";
              };
              const getSpeedColor = (num: number) => {
                if (num === 1) return { bg: "bg-emerald-500/20", border: "border-emerald-500/50", text: "text-emerald-400" };
                if (num === 2) return { bg: "bg-yellow-500/20", border: "border-yellow-500/50", text: "text-yellow-400" };
                if (num === 3) return { bg: "bg-orange-500/20", border: "border-orange-500/50", text: "text-orange-400" };
                if (num === 4) return { bg: "bg-purple-500/20", border: "border-purple-500/50", text: "text-purple-400" };
                return { bg: "bg-slate-700/50", border: "border-slate-600", text: "text-slate-300" };
              };
              const colors = getSpeedColor(speedNum);
              
              return (
                <TouchableOpacity
                  key={speedValue}
                  onPress={() => handleSpeedChange(speedValue)}
                  className={`mb-3 px-4 py-3 rounded-xl border flex-row items-center gap-3 ${
                    isActive
                      ? `${colors.bg} ${colors.border}`
                      : "bg-slate-700/50 border-slate-600"
                  } active:opacity-80`}
                >
                  <View className="flex-row gap-1 items-center">
                    {[1, 2, 3].map((level) => {
                      const getSpeedBarColor = (num: number, lvl: number) => {
                        if (num === 4) return "bg-purple-400";
                        if (num >= lvl) {
                          if (num === 1) return "bg-emerald-400";
                          if (num === 2) return "bg-yellow-400";
                          if (num === 3) return "bg-orange-500";
                          return "bg-blue-400";
                        }
                        return "bg-slate-600 opacity-25";
                      };
                      return (
                        <View
                          key={level}
                          className={`w-1.5 h-4 rounded ${
                            speedNum === 4
                              ? "bg-purple-400"
                              : speedNum >= level
                              ? getSpeedBarColor(speedNum, level)
                              : "bg-slate-600 opacity-25"
                          }`}
                        />
                      );
                    })}
                  </View>
                  <Text className={`text-base font-semibold flex-1 ${isActive ? colors.text : "text-slate-300"}`}>
                    {getSpeedLabel(speedNum)}
                  </Text>
                  {isActive && (
                    <View className={`w-2 h-2 rounded-full ${colors.text.replace("text-", "bg-")}`}></View>
                  )}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              onPress={() => setShowSpeedModal(false)}
              className="mt-4 pt-4 border-t border-slate-700"
            >
              <Text className="text-sm text-slate-400 text-center font-medium">
                Cancel
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Temperature modification modal */}
      <Modal
        visible={showTemperatureModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowTemperatureModal(false);
          setSelectedSensor(null);
        }}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => {
            setShowTemperatureModal(false);
            setSelectedSensor(null);
          }}
        >
          <Pressable
            className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg w-[85%] max-w-sm"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-lg font-bold text-slate-50 mb-2 text-center">
              Modify temperature
            </Text>
            {selectedSensor && (
              <Text className="text-sm text-slate-400 mb-4 text-center">
                {selectedSensor.name}
              </Text>
            )}
            
            <TemperatureInput
              initialTemperature={selectedSensor?.setpoint_temperature ?? null}
              onConfirm={handleTemperatureChange}
              onCancel={() => {
                setShowTemperatureModal(false);
                setSelectedSensor(null);
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {/* Status change modal */}
      <Modal
        visible={showStatusModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowStatusModal(false);
          setSelectedSensor(null);
        }}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => {
            setShowStatusModal(false);
            setSelectedSensor(null);
          }}
        >
          <Pressable
            className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg w-[85%] max-w-sm"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-lg font-bold text-slate-50 mb-2 text-center">
              Change status
            </Text>
            {selectedSensor && (
              <Text className="text-sm text-slate-400 mb-6 text-center">
                {selectedSensor.name}
              </Text>
            )}

            <TouchableOpacity
              onPress={() => handleStatusChange("03")}
              className={`mb-3 px-4 py-4 rounded-xl border flex-row items-center gap-3 ${
                selectedSensor?.status === "03"
                  ? "bg-emerald-500/20 border-emerald-500/50"
                  : "bg-slate-700/50 border-slate-600"
              } active:opacity-80`}
            >
              <View className="w-4 h-4 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/80" />
              <Text className={`text-base font-semibold flex-1 ${
                selectedSensor?.status === "03" ? "text-emerald-400" : "text-slate-300"
              }`}>
                Turn on
              </Text>
              {selectedSensor?.status === "03" && (
                <View className="w-2 h-2 rounded-full bg-emerald-400"></View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleStatusChange("02")}
              className={`px-4 py-4 rounded-xl border flex-row items-center gap-3 ${
                selectedSensor?.status === "02"
                  ? "bg-red-500/20 border-red-500/50"
                  : "bg-red-500/10 border-red-500/30"
              } active:opacity-80`}
            >
              <View className="w-4 h-4 rounded-full bg-red-500 shadow-md shadow-red-500/50" />
              <Text className={`text-base font-semibold flex-1 ${
                selectedSensor?.status === "02" ? "text-red-400" : "text-red-300"
              }`}>
                Turn off
              </Text>
              {selectedSensor?.status === "02" && (
                <View className="w-2 h-2 rounded-full bg-red-400"></View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowStatusModal(false);
                setSelectedSensor(null);
              }}
              className="mt-4 pt-4 border-t border-slate-700"
            >
              <Text className="text-sm text-slate-400 text-center font-medium">
                Cancel
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

interface TemperatureInputProps {
  initialTemperature: number | null;
  onConfirm: (temperature: number) => void;
  onCancel: () => void;
}

const TemperatureInput = ({ initialTemperature, onConfirm, onCancel }: TemperatureInputProps) => {
  const MIN_TEMP = 15;
  const MAX_TEMP = 30;
  const STEP = 0.5;
  
  const [temperature, setTemperature] = useState(
    initialTemperature !== null 
      ? Math.max(MIN_TEMP, Math.min(MAX_TEMP, initialTemperature))
      : 20
  );

  const adjustTemperature = (delta: number) => {
    const newTemp = Math.max(MIN_TEMP, Math.min(MAX_TEMP, temperature + delta));
    setTemperature(newTemp);
  };

  const handleConfirm = () => {
    onConfirm(temperature);
  };

  return (
    <>
      {/* Temperature display */}
      <View className="mb-6 items-center">
        <View className="flex-row items-baseline gap-1 mb-2">
          <Text className="text-5xl font-extrabold text-blue-400 tracking-tight">
            {temperature.toFixed(1)}
          </Text>
          <Text className="text-2xl font-semibold text-slate-400">°C</Text>
        </View>
        <Text className="text-xs text-slate-500">
          {MIN_TEMP}°C - {MAX_TEMP}°C
        </Text>
      </View>

      {/* +/- buttons */}
      <View className="flex-row items-center justify-center gap-4 mb-6">
        <TouchableOpacity
          onPress={() => adjustTemperature(-STEP)}
          disabled={temperature <= MIN_TEMP}
          className={`w-12 h-12 rounded-full items-center justify-center border-2 ${
            temperature <= MIN_TEMP
              ? "border-slate-600 bg-slate-700/30"
              : "border-blue-500 bg-blue-500/20 active:bg-blue-500/30"
          }`}
        >
          <Text className={`text-2xl font-bold ${temperature <= MIN_TEMP ? "text-slate-600" : "text-blue-400"}`}>
            −
          </Text>
        </TouchableOpacity>

        <View className="flex-1">
          {/* Visual slider */}
          <View className="h-2 bg-slate-700 rounded-full relative">
            <View
              className="absolute h-full bg-blue-500 rounded-full"
              style={{
                width: `${((temperature - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)) * 100}%`,
              }}
            />
            <View
              className="absolute w-6 h-6 bg-blue-500 rounded-full -top-2 border-2 border-slate-800 shadow-lg"
              style={{
                left: `${((temperature - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)) * 100}%`,
                marginLeft: -12,
              }}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => adjustTemperature(STEP)}
          disabled={temperature >= MAX_TEMP}
          className={`w-12 h-12 rounded-full items-center justify-center border-2 ${
            temperature >= MAX_TEMP
              ? "border-slate-600 bg-slate-700/30"
              : "border-blue-500 bg-blue-500/20 active:bg-blue-500/30"
          }`}
        >
          <Text className={`text-2xl font-bold ${temperature >= MAX_TEMP ? "text-slate-600" : "text-blue-400"}`}>
            +
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick buttons */}
      <View className="flex-row gap-2 mb-6">
        {[18, 20, 22, 24, 26].map((temp) => (
          <TouchableOpacity
            key={temp}
            onPress={() => setTemperature(temp)}
            className={`flex-1 py-2 rounded-lg border ${
              Math.abs(temperature - temp) < 0.1
                ? "bg-blue-500/20 border-blue-500/50"
                : "bg-slate-700/50 border-slate-600"
            } active:opacity-80`}
          >
            <Text className={`text-xs font-semibold text-center ${
              Math.abs(temperature - temp) < 0.1 ? "text-blue-400" : "text-slate-300"
            }`}>
              {temp}°
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action buttons */}
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={onCancel}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-600 bg-slate-700/50 active:opacity-80"
        >
          <Text className="text-slate-300 text-center font-semibold">
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleConfirm}
          className="flex-1 px-4 py-3 rounded-xl bg-blue-500 active:opacity-80"
        >
          <Text className="text-slate-50 text-center font-semibold">
            Confirm
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const formatLastSync = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return "just now";
    } else if (diffMins < 60) {
      return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} h${diffHours > 1 ? "" : ""} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  } catch (e) {
    return dateString;
  }
};

export default HomeScreen;