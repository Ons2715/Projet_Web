package com.projet.web.security;

import org.bouncycastle.crypto.generators.SCrypt;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Arrays;

public final class ScryptPassword {
    private ScryptPassword() {}

    public static String hash(String password) {
        byte[] salt = new byte[16];
        new SecureRandom().nextBytes(salt);
        byte[] key = SCrypt.generate(password.getBytes(StandardCharsets.UTF_8), salt, 16384, 8, 1, 64);
        return "scrypt:" + bytesToHex(salt) + ":" + bytesToHex(key);
    }

    public static boolean verify(String password, String stored) {
        if (stored == null || !stored.startsWith("scrypt:")) return false;
        try {
            String[] parts = stored.split(":");
            if (parts.length != 3) return false;
            byte[] salt = hexToBytes(parts[1]);
            byte[] storedKey = hexToBytes(parts[2]);
            byte[] candidate = SCrypt.generate(password.getBytes(StandardCharsets.UTF_8), salt, 16384, 8, 1, 64);
            return Arrays.equals(storedKey, candidate);
        } catch (Exception e) {
            return false;
        }
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder out = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) out.append(String.format("%02x", b));
        return out.toString();
    }

    private static byte[] hexToBytes(String value) {
        byte[] out = new byte[value.length() / 2];
        for (int i = 0; i < out.length; i++) {
            int index = i * 2;
            out[i] = (byte) Integer.parseInt(value.substring(index, index + 2), 16);
        }
        return out;
    }
}
