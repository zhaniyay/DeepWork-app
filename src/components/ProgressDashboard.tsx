import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, ProgressBar, Chip, Button } from 'react-native-paper';
import { useProgressStore } from '@/stores/progressStore';
import { colors } from '@/constants/colors';

interface ProgressDashboardProps {
  onViewSessions?: () => void;
  onViewAnalytics?: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  onViewSessions,
  onViewAnalytics,
}) => {
  const { stats, isLoading, getProgressStats } = useProgressStore();

  useEffect(() => {
    getProgressStats();
  }, []);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getProductivityColor = (score: number) => {
    if (score >= 80) return colors.success.primary;
    if (score >= 60) return colors.warning.primary;
    return colors.error.primary;
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '⚡';
    return '💪';
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="bodyLarge" style={styles.loadingText}>
          Loading progress...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Overview Stats */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.statNumber}>
              {stats.totalSessions}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Total Sessions
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.statNumber}>
              {formatTime(stats.totalFocusTime)}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Focus Time
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.statNumber}>
              {formatTime(stats.averageSessionLength)}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Avg Session
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.statNumber}>
              {Math.round(stats.completionRate)}%
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Completion Rate
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Streak Section */}
      <Card style={styles.streakCard}>
        <Card.Content>
          <View style={styles.streakHeader}>
            <Text variant="titleLarge" style={styles.streakTitle}>
              {getStreakEmoji(stats.currentStreak)} {stats.currentStreak} Day Streak
            </Text>
            <Chip mode="outlined" style={styles.streakChip}>
              Best: {stats.longestStreak} days
            </Chip>
          </View>
          <Text variant="bodyMedium" style={styles.streakDescription}>
            Keep up the great work! Consistency is key to building lasting productivity habits.
          </Text>
        </Card.Content>
      </Card>

      {/* Productivity Score */}
      <Card style={styles.productivityCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.productivityTitle}>
            Productivity Score
          </Text>
          <View style={styles.productivityContent}>
            <Text variant="displaySmall" style={[styles.productivityScore, { color: getProductivityColor(stats.productivityScore) }]}>
              {Math.round(stats.productivityScore)}
            </Text>
            <Text variant="bodyMedium" style={styles.productivityLabel}>
              / 100
            </Text>
          </View>
          <ProgressBar 
            progress={stats.productivityScore / 100} 
            color={getProductivityColor(stats.productivityScore)}
            style={styles.productivityBar}
          />
          <Text variant="bodySmall" style={styles.productivityDescription}>
            Based on session completion, focus quality, and consistency
          </Text>
        </Card.Content>
      </Card>

      {/* Weekly Focus Chart */}
      <Card style={styles.chartCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.chartTitle}>
            This Week's Focus Time
          </Text>
          <View style={styles.chartContainer}>
            {stats.weeklyFocusTime.map((time, index) => (
              <View key={index} style={styles.chartBar}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: Math.max(20, (time / Math.max(...stats.weeklyFocusTime)) * 100),
                      backgroundColor: colors.primary[600]
                    }
                  ]} 
                />
                <Text variant="bodySmall" style={styles.barLabel}>
                  {formatTime(time)}
                </Text>
                <Text variant="bodySmall" style={styles.dayLabel}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]}
                </Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={onViewSessions}
          style={styles.actionButton}
          icon="history"
        >
          View Sessions
        </Button>
        <Button
          mode="outlined"
          onPress={onViewAnalytics}
          style={styles.actionButton}
          icon="chart-line"
        >
          Detailed Analytics
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text.secondary.light,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    elevation: 2,
  },
  statNumber: {
    color: colors.primary[600],
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statLabel: {
    color: colors.text.secondary.light,
    textAlign: 'center',
    marginTop: 4,
  },
  streakCard: {
    marginBottom: 16,
    elevation: 2,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakTitle: {
    color: colors.text.primary.light,
    fontWeight: 'bold',
  },
  streakChip: {
    backgroundColor: colors.surface.secondary,
  },
  streakDescription: {
    color: colors.text.secondary.light,
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
  chartCard: {
    marginBottom: 16,
    elevation: 2,
  },
  chartTitle: {
    color: colors.text.primary.light,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  bar: {
    width: 20,
    borderRadius: 2,
    marginBottom: 4,
  },
  barLabel: {
    color: colors.text.secondary.light,
    textAlign: 'center',
    marginBottom: 2,
  },
  dayLabel: {
    color: colors.text.secondary.light,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
  },
}); 