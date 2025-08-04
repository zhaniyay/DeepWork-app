import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { Text, Card, Switch, Button, List, Divider, RadioButton, Portal, Modal } from 'react-native-paper';
import { useSettingsStore } from '@/stores/settingsStore';
import { colors } from '@/constants/colors';

export default function SettingsScreen() {
  const { preferences, updatePreferences, loadPreferences, resetPreferences, isLoading, error, lastSaved } = useSettingsStore();
  const [sessionLengthModalVisible, setSessionLengthModalVisible] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(preferences.sessionLength);
  const [inputText, setInputText] = useState(selectedMinutes.toString());

  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    setSelectedMinutes(preferences.sessionLength);
    setInputText(preferences.sessionLength.toString());
  }, [preferences.sessionLength]);

  const handleSessionLengthChange = (length: number) => {
    updatePreferences({ sessionLength: length });
    setSessionLengthModalVisible(false);
  };

  const handleTimerConfirm = () => {
    handleSessionLengthChange(selectedMinutes);
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

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to their default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            resetPreferences();
            Alert.alert('Settings Reset', 'All settings have been reset to their default values.');
          }
        },
      ]
    );
  };

  // Generate minutes options from 5 to 180
  const minutesOptions = Array.from({ length: 176 }, (_, i) => i + 5);

  const isValidInput = (text: string) => {
    const minutes = parseInt(text);
    return !isNaN(minutes) && minutes >= 5 && minutes <= 180;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Settings
        </Text>
        {lastSaved && (
          <Text variant="bodySmall" style={styles.savedIndicator}>
            ✓ Settings saved
          </Text>
        )}
        {error && (
          <Text variant="bodySmall" style={styles.errorIndicator}>
            ⚠ {error}
          </Text>
        )}
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
              left={(props) => <List.Icon {...props} icon="clock" />}
              onPress={() => setSessionLengthModalVisible(true)}
            />
            
            <List.Item
              title="Auto-start Next Session"
              description="Automatically start a new session after completing one"
              left={(props) => <List.Icon {...props} icon="play-circle" />}
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
              left={(props) => <List.Icon {...props} icon="alert-circle" />}
              right={() => (
                <Switch
                  value={preferences.autoLogDistractions}
                  onValueChange={(value) => updatePreferences({ autoLogDistractions: value })}
                />
              )}
            />
            
            <List.Item
              title="Quiet Hours"
              description={`${preferences.quietHours.start} - ${preferences.quietHours.end}`}
              left={(props) => <List.Icon {...props} icon="weather-night" />}
              right={() => (
                <Switch
                  value={preferences.quietHours.enabled}
                  onValueChange={(value) => 
                    updatePreferences({
                      quietHours: {
                        ...preferences.quietHours,
                        enabled: value,
                      },
                    })
                  }
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
              left={(props) => <List.Icon {...props} icon="bell" />}
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
              left={(props) => <List.Icon {...props} icon="lightbulb" />}
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
              left={(props) => <List.Icon {...props} icon="coffee" />}
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
              left={(props) => <List.Icon {...props} icon="trophy" />}
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
              left={(props) => <List.Icon {...props} icon="robot" />}
            />
            
            <RadioButton.Group
              onValueChange={handleAIToneChange}
              value={preferences.aiPreferences.tone}
            >
              <RadioButton.Item label="Professional" value="professional" />
              <RadioButton.Item label="Friendly" value="friendly" />
              <RadioButton.Item label="Motivational" value="motivational" />
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

      {/* Simple Text Input Modal */}
      <Portal>
        <Modal
          visible={sessionLengthModalVisible}
          onDismiss={() => setSessionLengthModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Content>
              <Text variant="titleLarge" style={styles.modalTitle}>
                Set Session Duration
              </Text>
              <Text variant="bodyMedium" style={styles.modalDescription}>
                Enter your preferred focus session length in minutes
              </Text>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.timeInput,
                    !isValidInput(inputText) && styles.invalidInput
                  ]}
                  placeholder="Enter minutes (5-180)"
                  keyboardType="numeric"
                  value={inputText}
                  onChangeText={(text) => {
                    setInputText(text);
                    // Only update if it's a valid number in range
                    const minutes = parseInt(text);
                    if (!isNaN(minutes) && minutes >= 5 && minutes <= 180) {
                      setSelectedMinutes(minutes);
                    }
                    // If invalid, don't update selectedMinutes (keep current value)
                  }}
                  maxLength={3}
                />
                <Text variant="bodySmall" style={styles.inputLabel}>
                  minutes
                </Text>
              </View>
              
              {!isValidInput(inputText) && inputText !== '' && (
                <Text variant="bodySmall" style={styles.errorText}>
                  Please enter a number between 5 and 180
                </Text>
              )}
              
              <View style={styles.modalButtons}>
                <Button
                  mode="outlined"
                  onPress={() => setSessionLengthModalVisible(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleTimerConfirm}
                  style={styles.confirmButton}
                  disabled={!isValidInput(inputText)}
                >
                  Set Duration
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
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
  modalContainer: {
    padding: 20,
    backgroundColor: colors.background.light,
    borderRadius: 10,
    elevation: 5,
    margin: 20,
    maxWidth: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    color: colors.text.primary.light,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDescription: {
    color: colors.text.secondary.light,
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  optionButtonContent: {
    height: 'auto',
  },
  cancelButton: {
    marginTop: 10,
  },
  savedIndicator: {
    color: colors.success.primary,
    textAlign: 'center',
    marginTop: 8,
  },
  errorIndicator: {
    color: colors.error.primary,
    textAlign: 'center',
    marginTop: 8,
  },
  customTitle: {
    color: colors.text.primary.light,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 8,
  },
  customInput: {
    backgroundColor: colors.surface.light,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: colors.text.primary.light,
    borderWidth: 1,
    borderColor: colors.primary[300],
    marginBottom: 10,
  },
  customButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  customButtonContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  validationText: {
    marginTop: 5,
    textAlign: 'center',
  },
  currentSessionText: {
    color: colors.text.secondary.light,
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  confirmButton: {
    flex: 1,
    marginLeft: 10,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  timeInput: {
    flex: 1,
    backgroundColor: colors.surface.light,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: colors.text.primary.light,
    borderWidth: 1,
    borderColor: colors.primary[300],
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    width: '50%',
  },
  inputLabel: {
    color: colors.text.secondary.light,
    marginLeft: 5,
  },
  invalidInput: {
    borderColor: colors.error.primary,
    borderWidth: 2,
  },
  errorText: {
    color: colors.error.primary,
    textAlign: 'center',
    marginTop: 5,
  },
}); 