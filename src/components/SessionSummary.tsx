import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, ProgressBar, Chip } from 'react-native-paper';
import { Task } from '@/types/task';
import { colors } from '@/constants/colors';

interface SessionSummaryProps {
  task: Task;
  duration: number; // intended duration in minutes
  actualDuration: number; // actual duration in minutes
  interruptions: number;
  outcome: 'completed' | 'partial' | 'abandoned';
  productivityScore: number;
  onStartNextSession?: () => void;
  onTakeBreak?: () => void;
  onBackToDashboard?: () => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({
  task,
  duration,
  actualDuration,
  interruptions,
  outcome,
  productivityScore,
  onStartNextSession,
  onTakeBreak,
  onBackToDashboard,
}) => {
  const getOutcomeEmoji = (outcome: string) => {
    switch (outcome) {
      case 'completed': return '🎉';
      case 'partial': return '👍';
      case 'abandoned': return '😔';
      default: return '📝';
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'completed': return colors.success.primary;
      case 'partial': return colors.warning.primary;
      case 'abandoned': return colors.error.primary;
      default: return colors.text.secondary.light;
    }
  };

  const getProductivityColor = (score: number) => {
    if (score >= 80) return colors.success.primary;
    if (score >= 60) return colors.warning.primary;
    return colors.error.primary;
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const completionRate = (actualDuration / duration) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.outcomeTitle}>
            {getOutcomeEmoji(outcome)} Session {outcome.charAt(0).toUpperCase() + outcome.slice(1)}!
          </Text>
          <Text variant="bodyLarge" style={styles.taskTitle}>
            {task.title}
          </Text>
        </Card.Content>
      </Card>

      {/* Session Stats */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.statsTitle}>
            Session Summary
          </Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {formatTime(actualDuration)}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Time Focused
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {interruptions}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Interruptions
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {Math.round(completionRate)}%
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Completion
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Productivity Score */}
      <Card style={styles.productivityCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.productivityTitle}>
            Productivity Score
          </Text>
          
          <View style={styles.productivityContent}>
            <Text variant="displaySmall" style={[styles.productivityScore, { color: getProductivityColor(productivityScore) }]}>
              {Math.round(productivityScore)}
            </Text>
            <Text variant="bodyMedium" style={styles.productivityLabel}>
              / 100
            </Text>
          </View>
          
          <ProgressBar 
            progress={productivityScore / 100} 
            color={getProductivityColor(productivityScore)}
            style={styles.productivityBar}
          />
          
          <Text variant="bodySmall" style={styles.productivityDescription}>
            Based on focus time, completion rate, and interruptions
          </Text>
        </Card.Content>
      </Card>

      {/* Outcome Analysis */}
      <Card style={styles.analysisCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.analysisTitle}>
            Session Analysis
          </Text>
          
          <View style={styles.analysisItems}>
            <View style={styles.analysisItem}>
              <Text variant="bodyMedium" style={styles.analysisLabel}>
                Focus Quality:
              </Text>
              <Chip 
                mode="outlined" 
                style={[styles.analysisChip, { borderColor: getProductivityColor(productivityScore) }]}
                textStyle={{ color: getProductivityColor(productivityScore) }}
              >
                {productivityScore >= 80 ? 'Excellent' : productivityScore >= 60 ? 'Good' : 'Needs Improvement'}
              </Chip>
            </View>
            
            <View style={styles.analysisItem}>
              <Text variant="bodyMedium" style={styles.analysisLabel}>
                Time Efficiency:
              </Text>
              <Chip 
                mode="outlined" 
                style={[styles.analysisChip, { borderColor: completionRate >= 90 ? colors.success.primary : colors.warning.primary }]}
                textStyle={{ color: completionRate >= 90 ? colors.success.primary : colors.warning.primary }}
              >
                {completionRate >= 90 ? 'On Target' : completionRate >= 70 ? 'Close' : 'Under Target'}
              </Chip>
            </View>
            
            <View style={styles.analysisItem}>
              <Text variant="bodyMedium" style={styles.analysisLabel}>
                Distraction Level:
              </Text>
              <Chip 
                mode="outlined" 
                style={[styles.analysisChip, { borderColor: interruptions <= 1 ? colors.success.primary : colors.warning.primary }]}
                textStyle={{ color: interruptions <= 1 ? colors.success.primary : colors.warning.primary }}
              >
                {interruptions === 0 ? 'Focused' : interruptions <= 2 ? 'Some Distractions' : 'Very Distracted'}
              </Chip>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Next Steps */}
      <Card style={styles.nextStepsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.nextStepsTitle}>
            What's Next?
          </Text>
          
          <View style={styles.nextStepsButtons}>
            {onStartNextSession && (
              <Button
                mode="contained"
                onPress={onStartNextSession}
                style={styles.nextStepButton}
                icon="play"
              >
                Start Next Session
              </Button>
            )}
            
            {onTakeBreak && (
              <Button
                mode="outlined"
                onPress={onTakeBreak}
                style={styles.nextStepButton}
                icon="coffee"
              >
                Take a Break
              </Button>
            )}
            
            <Button
              mode="outlined"
              onPress={onBackToDashboard}
              style={styles.nextStepButton}
              icon="home"
            >
              Back to Dashboard
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background.light,
  },
  headerCard: {
    marginBottom: 16,
    elevation: 2,
  },
  outcomeTitle: {
    color: colors.text.primary.light,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    color: colors.text.secondary.light,
    textAlign: 'center',
  },
  statsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  statsTitle: {
    color: colors.text.primary.light,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: colors.primary[600],
    fontWeight: 'bold',
  },
  statLabel: {
    color: colors.text.secondary.light,
    marginTop: 4,
  },
  productivityCard: {
    marginBottom: 16,
    elevation: 2,
  },
  productivityTitle: {
    color: colors.text.primary.light,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  productivityContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 12,
  },
  productivityScore: {
    fontWeight: 'bold',
  },
  productivityLabel: {
    color: colors.text.secondary.light,
    marginLeft: 4,
  },
  productivityBar: {
    marginBottom: 8,
    height: 8,
    borderRadius: 4,
  },
  productivityDescription: {
    color: colors.text.secondary.light,
    textAlign: 'center',
  },
  analysisCard: {
    marginBottom: 16,
    elevation: 2,
  },
  analysisTitle: {
    color: colors.text.primary.light,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  analysisItems: {
    gap: 12,
  },
  analysisItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  analysisLabel: {
    color: colors.text.primary.light,
    flex: 1,
  },
  analysisChip: {
    backgroundColor: colors.surface.secondary,
  },
  nextStepsCard: {
    elevation: 2,
  },
  nextStepsTitle: {
    color: colors.text.primary.light,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  nextStepsButtons: {
    gap: 12,
  },
  nextStepButton: {
    marginBottom: 8,
  },
}); 