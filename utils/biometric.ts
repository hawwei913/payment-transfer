import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";

interface BiometricAuthResult {
  success: boolean;
  error?: string;
  biometricType?: "fingerprint" | "face" | "iris";
}

export const checkBiometricSupport = async () => {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const supportedTypes =
      await LocalAuthentication.supportedAuthenticationTypesAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const enrolledLevel = await LocalAuthentication.getEnrolledLevelAsync();

    return {
      hasHardware,
      supportedTypes,
      isEnrolled,
      enrolledLevel,
      isAvailable:
        hasHardware &&
        isEnrolled &&
        supportedTypes.length > 0 &&
        enrolledLevel > 0,
    };
  } catch (error) {
    console.error("Error checking biometric support:", error);
    return {
      hasHardware: false,
      supportedTypes: [],
      isEnrolled: false,
      enrolledLevel: null,
      isAvailable: false,
    };
  }
};

export const authenticateWithBiometrics =
  async (): Promise<BiometricAuthResult> => {
    try {
      if (Platform.OS === "web") {
        // Web fallback - simulate biometric authentication
        return { success: true, biometricType: "fingerprint" };
      }

      const { isAvailable, supportedTypes } = await checkBiometricSupport();

      if (!isAvailable) {
        return {
          success: false,
          error: "Biometric authentication is not available on this device",
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to complete payment",
      });

      if (result.success) {
        const biometricType = (
          supportedTypes as LocalAuthentication.AuthenticationType[]
        ).includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
          ? "face"
          : "fingerprint";

        return { success: true, biometricType };
      } else {
        return {
          success: false,
          error:
            result.error === "user_cancel"
              ? "Authentication cancelled"
              : "Authentication failed",
        };
      }
    } catch (error) {
      console.error("Biometric authentication error:", error);
      return {
        success: false,
        error: "Authentication failed. Please try again.",
      };
    }
  };
