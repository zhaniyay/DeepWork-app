import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Switch, Button, List, Divider, RadioButton } from 'react-native-paper';
import { useSettingsStore } from '@/stores/settingsStore';
import { colors } from '@/constants/colors';

export default function SettingsScreen() {
  const { preferences, updatePreferences, loadPreferences, resetPreferences, isLoading } = useSettingsStore();

  useEffect(() => {
    loadPreferences();
  }, []);

  const handleSessionLengthChange = (length: number) => {
    updatePreferences({ sessionLength: length });
  };

  const handleNotificationToggle = (key: keyof typeof preferences.notifications) => {
    updatePreferences({
      notifications: {
        ...preferences.notifications,
        [key]: !preferences.notifications[key],
      },
    });
  };

  const handleAIToneChange = (tone: string) => {
    updatePreferences({
      aiPreferences: {
        ...preferences.aiPreferences,
        tone: tone as 'professional' | 'friendly' | 'motivational',
      },
    });
  };

  const handleAIAggressivenessChange = (aggressiveness: string) => {
    updatePreferences({
      aiPreferences: {
        ...preferences.aiPreferences,
        aggressiveness: aggressiveness as 'conservative' | 'balanced' | 'aggressive',
      },
    });
  };

  const handleThemeChange = (theme: string) => {
    updatePreferences({ theme: theme as 'light' | 'dark' | 'auto' });
  };

  const handleResetSettings = () => {
    resetPreferences();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Settings
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Session Settings */}
        <Card style={styles.section}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Focus Session
            </Text>
            
            <List.Item
              title="Default Session Length"
              description={`${preferences.sessionLength} minutes`}
              left={(props) => <List.Icon {...props} icon="clock-outline" />}
              onPress={() => {
                // TODO: Show session length picker
                console.log('Change session length');
              }}
            />
            
            <List.Item
              title="Auto-start Next Session"
              description="Automatically start a new session after completing one"
              left={(props) => <List.Icon {...props} icon="play-circle-outline" />}
              right={() => (
                <Switch
                  value={preferences.autoStartNextSession}
                  onValueChange={(value) => updatePreferences({ autoStartNextSession: value })}
                />
              )}
            />
            
            <List.Item
              title="Auto-log Distractions"
              description="Automatically track when you leave the app during focus sessions"
              left={(props) => <List.Icon {...props} icon="alert-circle-outline" />}
              right={() => (
                <Switch
                  value={preferences.autoLogDistractions}
                  onValueChange={(value) => updatePreferences({ autoLogDistractions: value })}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Notifications */}
        <Card style={styles.section}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Notifications
            </Text>
            
            <List.Item
              title="Session Reminders"
              description="Remind you to start your scheduled focus sessions"
              left={(props) => <List.Icon {...props} icon="bell-outline" />}
              right={() => (
                <Switch
                  value={preferences.notifications.sessionReminders}
                  onValueChange={() => handleNotificationToggle('sessionReminders')}
                />
              )}
            />
            
            <List.Item
              title="Task Due Soon"
              description="Notify you when tasks are approaching their due date"
              left={(props) => <List.Icon {...props} icon="calendar-clock" />}
              right={() => (
                <Switch
                  value={preferences.notifications.taskDueSoon}
                  onValueChange={() => handleNotificationToggle('taskDueSoon')}
                />
              )}
            />
            
            <List.Item
              title="Suggested Next Task"
              description="Get AI suggestions for your next focus session"
              left={(props) => <List.Icon {...props} icon="lightbulb-outline" />}
              right={() => (
                <Switch
                  value={preferences.notifications.suggestedNextTask}
                  onValueChange={() => handleNotificationToggle('suggestedNextTask')}
                />
              )}
            />
            
            <List.Item
              title="Break Suggestions"
              description="Suggest breaks after completing focus sessions"
              left={(props) => <List.Icon {...props} icon="coffee-outline" />}
              right={() => (
                <Switch
                  value={preferences.notifications.breakSuggestions}
                  onValueChange={() => handleNotificationToggle('breakSuggestions')}
                />
              )}
            />
            
            <List.Item
              title="Streak Achievements"
              description="Celebrate your productivity streaks"
              left={(props) => <List.Icon {...props} icon="trophy-outline" />}
              right={() => (
                <Switch
                  value={preferences.notifications.streakAchievements}
                  onValueChange={() => handleNotificationToggle('streakAchievements')}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* AI Preferences */}
        <Card style={styles.section}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              AI Assistant
            </Text>
            
            <List.Item
              title="AI Tone"
              description="How the AI communicates with you"
              left={(props) => <List.Icon {...props} icon="robot-outline" />}
            />
            
            <RadioButton.Group
              onValueChange={handleAIToneChange}
              value={preferences.aiPreferences.tone}
            >
              <RadioButton.Item label="Professional" value="professional" />
              <RadioButton.Item label="Friendly" value="friendly" />
              <RadioButton.Item label="Motivational" value="motivational" />
            </RadioButton.Group>
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="AI Aggressiveness"
              description="How aggressively the AI prioritizes tasks"
              left={(props) => <List.Icon {...props} icon="trending-up" />}
            />
            
            <RadioButton.Group
              onValueChange={handleAIAggressivenessChange}
              value={preferences.aiPreferences.aggressiveness}
            >
              <RadioButton.Item label="Conservative" value="conservative" />
              <RadioButton.Item label="Balanced" value="balanced" />
              <RadioButton.Item label="Aggressive" value="aggressive" />
            </RadioButton.Group>
            
            <List.Item
              title="Auto Suggestions"
              description="Automatically suggest next tasks and session durations"
              left={(props) => <List.Icon {...props} icon="auto-fix" />}
              right={() => (
                <Switch
                  value={preferences.aiPreferences.autoSuggestions}
                  onValueChange={(value) => 
                    updatePreferences({
                      aiPreferences: {
                        ...preferences.aiPreferences,
                        autoSuggestions: value,
                      },
                    })
                  }
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Appearance */}
        <Card style={styles.section}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Appearance
            </Text>
            
            <List.Item
              title="Theme"
              description="Choose your preferred app theme"
              left={(props) => <List.Icon {...props} icon="palette-outline" />}
            />
            
            <RadioButton.Group
              onValueChange={handleThemeChange}
              value={preferences.theme}
            >
              <RadioButton.Item label="Light" value="light" />
              <RadioButton.Item label="Dark" value="dark" />
              <RadioButton.Item label="Auto" value="auto" />
            </RadioButton.Group>
            
            <List.Item
              title="Sound Effects"
              description="Play sounds during focus sessions"
              left={(props) => <List.Icon {...props} icon="volume-high" />}
              right={() => (
                <Switch
                  value={preferences.soundEnabled}
                  onValueChange={(value) => updatePreferences({ soundEnabled: value })}
                />
              )}
            />
            
            <List.Item
              title="Vibration"
              description="Vibrate for notifications and session events"
              left={(props) => <List.Icon {...props} icon="vibrate" />}
              right={() => (
                <Switch
                  value={preferences.vibrationEnabled}
                  onValueChange={(value) => updatePreferences({ vibrationEnabled: value })}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Reset Settings */}
        <Card style={styles.section}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Data & Privacy
            </Text>
            
            <Button
              mode="outlined"
              onPress={handleResetSettings}
              style={styles.resetButton}
              icon="refresh"
              loading={isLoading}
            >
              Reset All Settings
            </Button>
            
            <Text variant="bodySmall" style={styles.resetDescription}>
              This will reset all your preferences to their default values. Your tasks and progress data will not be affected.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: colors.surface.light,
    elevation: 2,
  },
  title: {
    color: colors.primary[600],
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    color: colors.text.primary.light,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  divider: {
    marginVertical: 8,
  },
  resetButton: {
    marginBottom: 8,
  },
  resetDescription: {
    color: colors.text.secondary.light,
    textAlign: 'center',
  },
}); 