import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/providers/ThemeProvider';
import { ResponsiveContainer } from '../../src/components/ResponsiveContainer';

export default function TrainScreen() {
  const { theme } = useTheme();

  const trainingCategories = [
    { id: 'tactics', title: 'Tactics', description: 'Sharpen your tactical vision', difficulty: 'Beginner', icon: 'lightbulb' },
    { id: 'endgames', title: 'Endgames', description: 'Master key endgame positions', difficulty: 'Intermediate', icon: 'chess-king' },
    { id: 'openings', title: 'Openings', description: 'Learn opening principles', difficulty: 'Advanced', icon: 'rocket-launch' },
    { id: 'strategy', title: 'Strategy', description: 'Develop strategic thinking', difficulty: 'Expert', icon: 'brain' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ResponsiveContainer>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Training
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Improve your chess skills with targeted exercises
            </Text>
          </View>

          <View style={styles.stats}>
            <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>24</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Exercises Completed</Text>
              </Card.Content>
            </Card>
            <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>1,250</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Rating Points</Text>
              </Card.Content>
            </Card>
            <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>7</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Day Streak</Text>
              </Card.Content>
            </Card>
          </View>

          <View style={styles.categories}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Training Categories
            </Text>
            {trainingCategories.map((category) => (
              <Card
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: theme.colors.surface }]}
              >
                <Card.Content>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryInfo}>
                      <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>
                        {category.title}
                      </Text>
                      <Text style={[styles.categoryDescription, { color: theme.colors.textSecondary }]}>
                        {category.description}
                      </Text>
                      <Chip
                        mode="outlined"
                        textStyle={{ color: theme.colors.primary }}
                        style={{ borderColor: theme.colors.primary, marginTop: 8 }}
                      >
                        {category.difficulty}
                      </Chip>
                    </View>
                    <Button
                      mode="contained"
                      onPress={() => {
                        // TODO: Navigate to category training
                      }}
                      style={[styles.startButton, { backgroundColor: theme.colors.primary }]}
                      textColor={theme.colors.background}
                    >
                      Start
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>

          <Card style={[styles.dailyChallenge, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.challengeTitle, { color: theme.colors.text }]}>
                Daily Challenge
              </Text>
              <Text style={[styles.challengeDescription, { color: theme.colors.textSecondary }]}>
                Solve today's tactical puzzle and earn bonus points
              </Text>
              <Button
                mode="contained"
                onPress={() => {
                  // TODO: Start daily challenge
                }}
                style={[styles.challengeButton, { backgroundColor: theme.colors.secondary }]}
                textColor={theme.colors.background}
              >
                Take Challenge
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </ResponsiveContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  categories: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoryCard: {
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  startButton: {
    marginLeft: 16,
  },
  dailyChallenge: {
    margin: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  challengeButton: {
    alignSelf: 'flex-start',
  },
});
