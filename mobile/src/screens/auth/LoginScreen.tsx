/**
 * Login Screen
 * Authentication screen for users
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ScreenContainer } from '../../components/shared/ScreenContainer';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, FontSizes } from '../../config/theme';

export function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Shadowkeep</Text>
          <Text style={styles.subtitle}>Campaign Manager</Text>
        </View>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back</Text>

          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            onPress={handleLogin}
            loading={loading}
            fullWidth
            style={styles.button}
          >
            Sign In
          </Button>

          <Text style={styles.info}>
            Contact your DM for account credentials
          </Text>
        </Card>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: '700',
    color: Colors.primary.pink,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    color: Colors.text.secondary,
  },
  card: {
    marginHorizontal: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.md,
  },
  error: {
    color: Colors.error,
    fontSize: FontSizes.sm,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  info: {
    fontSize: FontSizes.sm,
    color: Colors.text.muted,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});
