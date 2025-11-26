// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../auth/AuthContext";
import Logo from "../components/Logo";

const LoginScreen = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    if (!username || !password) {
      setError("Merci de renseigner identifiant et mot de passe.");
      return;
    }

    try {
      setError(null);
      setLoading(true);
      await login(username.trim(), password);
    } catch (e: any) {
      console.error(e);
      setError(
        e?.response?.data?.detail ||
          e?.message ||
          "Impossible de se connecter."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-900"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1 px-6 justify-center">
        {/* Logo et titre */}
        <View className="items-center mb-8">
          <View className="mb-6">
            <Logo size={80} />
          </View>
          <Text className="text-[40px] font-extrabold text-slate-50 tracking-tight mb-2">
            KoolControl
          </Text>
          <Text className="text-lg text-slate-400 text-center">
            Pilote ton confort, simplement
          </Text>
        </View>

        {/* Formulaire */}
        <View className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg">
          <View className="mb-4">
            <Text className="text-slate-300 text-base font-semibold mb-2">
              Identifiant
            </Text>
            <TextInput
              className="border border-slate-700 rounded-xl px-4 py-3.5 text-slate-50 bg-slate-900 text-base"
              placeholder="Email ou username"
              placeholderTextColor="#6B7280"
              autoCapitalize="none"
              keyboardType="email-address"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View className="mb-4">
            <Text className="text-slate-300 text-base font-semibold mb-2">
              Mot de passe
            </Text>
            <TextInput
              className="border border-slate-700 rounded-xl px-4 py-3.5 text-slate-50 bg-slate-900 text-base"
              placeholder="Mot de passe"
              placeholderTextColor="#6B7280"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {error && (
            <View className="mb-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl">
              <Text className="text-orange-500 text-base font-medium">
                {error}
              </Text>
            </View>
          )}

          <Pressable
            onPress={onSubmit}
            className={`mt-2 rounded-full bg-blue-500 py-4 items-center ${
              loading ? "opacity-60" : "active:opacity-80"
            }`}
            disabled={loading}
          >
            {loading ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator size="small" color="#0B1120" />
                <Text className="text-slate-900 text-lg font-semibold">
                  Connexion...
                </Text>
              </View>
            ) : (
              <Text className="text-slate-900 text-lg font-semibold">
                Se connecter
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;