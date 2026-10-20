import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'http://192.168.1.15:8000/api/login/';

type UserRole = 'student' | 'teacher';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      Alert.alert(
        'Missing details',
        'Please enter your email and password.'
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: cleanEmail,
          password,
        }),
      });

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        Alert.alert(
          'Server Response Error',
          `Django returned a non-JSON response. HTTP status: ${response.status}`
        );
        return;
      }

      if (response.ok && data.success) {
        Alert.alert(
          'Login Successful',
          `Welcome ${data.username || cleanEmail}!`,
          [
            {
              text: 'OK',
              onPress: () => router.replace('/home' as any),
            },
          ]
        );
      } else {
        Alert.alert(
          'Login Failed',
          data.message || 'Invalid email or password.'
        );
      }
    } catch (error) {
      Alert.alert(
        'Connection Error',
        'Cannot connect to Django. Check your server, IP address, Wi-Fi, and firewall.'
      );
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back!</Text>

          <Text style={styles.subtitle}>
            Login to your Learn Hub account
          </Text>

          {/* Student / Teacher selection */}
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'student' && styles.selectedRole,
              ]}
              onPress={() => setRole('student')}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.roleIcon,
                  role === 'student' && styles.selectedRoleText,
                ]}
              >
                🎓
              </Text>
              <Text
                style={[
                  styles.roleText,
                  role === 'student' && styles.selectedRoleText,
                ]}
              >
                Student
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'teacher' && styles.selectedRole,
              ]}
              onPress={() => setRole('teacher')}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.roleIcon,
                  role === 'teacher' && styles.selectedRoleText,
                ]}
              >
                👨‍🏫
              </Text>
              <Text
                style={[
                  styles.roleText,
                  role === 'teacher' && styles.selectedRoleText,
                ]}
              >
                Teacher
              </Text>
            </TouchableOpacity>
          </View>

          {/* Email */}
          <Text style={styles.label}>Email *</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>✉</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#8A94A6"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              returnKeyType="next"
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Password *</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#8A94A6"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              onSubmitEditing={handleLogin}
              returnKeyType="go"
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
              style={styles.eyeButton}
            >
              <Text style={styles.eyeIcon}>
                {showPassword ? '🙈' : '👁'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Sign up */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>
              Don't have an account?{' '}
            </Text>

            <TouchableOpacity
              onPress={() => router.push('/signup' as any)}
              disabled={loading}
            >
              <Text style={styles.signupLink}>Sign Up Here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF5FC',
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  card: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 22,
    borderRadius: 14,
    elevation: 3,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2874F0',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 13,
    color: '#667085',
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 22,
  },

  roleContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },

  roleButton: {
    flex: 1,
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: '#DCE3ED',
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
  },

  selectedRole: {
    backgroundColor: '#E7F0FF',
    borderColor: '#4285FF',
  },

  roleIcon: {
    fontSize: 15,
  },

  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475467',
  },

  selectedRoleText: {
    color: '#2563EB',
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#344054',
    marginBottom: 7,
  },

  inputContainer: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8E0EA',
    borderRadius: 8,
    paddingHorizontal: 11,
    marginBottom: 17,
    backgroundColor: '#FFFFFF',
  },

  inputIcon: {
    fontSize: 16,
    color: '#667085',
    marginRight: 9,
  },

  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 10,
    fontSize: 12,
    color: '#101828',
  },

  eyeButton: {
    padding: 5,
    marginLeft: 4,
  },

  eyeIcon: {
    fontSize: 15,
  },

  loginButton: {
    minHeight: 44,
    backgroundColor: '#2463EB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  disabledButton: {
    opacity: 0.6,
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 18,
  },

  signupText: {
    fontSize: 11,
    color: '#667085',
  },

  signupLink: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
});