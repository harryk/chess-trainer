import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Avatar, Button, Chip, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/providers/ThemeProvider';
import { ResponsiveContainer } from '../../src/components/ResponsiveContainer';

export default function ProfileScreen() {
  const { theme } = useTheme();

  const achievements = [
    { id: '1', title: 'First Win', description: 'Win your first game', icon: 'trophy', unlocked: true },
    { id: '2', title: 'Tactical Master', description: 'Solve 50 tactical puzzles', icon: 'lightbulb', unlocked: true },
    { id: '3', title: 'Endgame Expert', description: 'Master 10 endgame positions', icon: 'chess-king', unlocked: false },
    { id: '4', title: 'Opening Scholar', description: 'Learn 5 opening variations', icon: 'rocket-launch', unlocked: false },
  ];

  const recentGames = [
    { id: '1', opponent: 'ChessMaster123', result: 'W', rating: '+15', date: '2 hours ago' },
    { id: '2', opponent: 'PawnPusher', result: 'L', rating: '-8', date: '1 day ago' },
    { id: '3', opponent: 'KnightRider', result: 'W', rating: '+12', date: '2 days ago' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ResponsiveContainer>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Avatar.Text
              size={80}
              label="JG"
              style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
              labelStyle={{ color: theme.colors.background, fontSize: 32 }}
            />
            <Text style={[styles.username, { color: theme.colors.text }]}>
              Johan Goransson
            </Text>
            <Text style={[styles.userTitle, { color: theme.colors.textSecondary }]}>
              Chess Enthusiast
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={[styles.rating, { color: theme.colors.primary }]}>
                1,250
              </Text>
              <Text style={[styles.ratingLabel, { color: theme.colors.textSecondary }]}>
                Rating
              </Text>
            </View>
          </View>

          <View style={styles.stats}>
            <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>47</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Games Played</Text>
              </Card.Content>
            </Card>
            <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>32</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Wins</Text>
              </Card.Content>
            </Card>
            <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>68%</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Win Rate</Text>
              </Card.Content>
            </Card>
          </View>

          <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Recent Games
              </Text>
              {recentGames.map((game) => (
                <List.Item
                  key={game.id}
                  title={game.opponent}
                  description={game.date}
                  left={() => (
                    <View style={[
                      styles.resultBadge,
                      {
                        backgroundColor: game.result === 'W' ? '#4CAF50' : '#F44336',
                      }
                    ]}>
                      <Text style={styles.resultText}>{game.result}</Text>
                    </View>
                  )}
                  right={() => (
                    <View style={styles.gameRating}>
                      <Text style={[
                        styles.ratingChange,
                        { color: game.rating.startsWith('+') ? '#4CAF50' : '#F44336' }
                      ]}>
                        {game.rating}
                      </Text>
                    </View>
                  )}
                  titleStyle={{ color: theme.colors.text }}
                  descriptionStyle={{ color: theme.colors.textSecondary }}
                />
              ))}
            </Card.Content>
          </Card>

          <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Achievements
              </Text>
              <View style={styles.achievements}>
                {achievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    style={[
                      styles.achievementCard,
                      {
                        backgroundColor: achievement.unlocked 
                          ? theme.colors.surface 
                          : theme.colors.background,
                        opacity: achievement.unlocked ? 1 : 0.6,
                      }
                    ]}
                  >
                    <Card.Content>
                      <View style={styles.achievementContent}>
                        <Avatar.Icon
                          size={40}
                          icon={achievement.icon}
                          style={{
                            backgroundColor: achievement.unlocked 
                              ? theme.colors.primary 
                              : theme.colors.textSecondary,
                          }}
                          iconColor={theme.colors.background}
                        />
                        <View style={styles.achievementInfo}>
                          <Text style={[styles.achievementTitle, { color: theme.colors.text }]}>
                            {achievement.title}
                          </Text>
                          <Text style={[styles.achievementDescription, { color: theme.colors.textSecondary }]}>
                            {achievement.description}
                          </Text>
                        </View>
                        {achievement.unlocked && (
                          <Chip mode="outlined" textStyle={{ color: theme.colors.primary }}>
                            Unlocked
                          </Chip>
                        )}
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </View>
            </Card.Content>
          </Card>

          <View style={styles.actions}>
            <Button
              mode="outlined"
              onPress={() => {
                // TODO: Edit profile
              }}
              style={[styles.actionButton, { borderColor: theme.colors.primary }]}
              textColor={theme.colors.primary}
            >
              Edit Profile
            </Button>
            <Button
              mode="outlined"
              onPress={() => {
                // TODO: View game history
              }}
              style={[styles.actionButton, { borderColor: theme.colors.primary }]}
              textColor={theme.colors.primary}
            >
              Game History
            </Button>
          </View>
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
  avatar: {
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  rating: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  ratingLabel: {
    fontSize: 14,
    marginTop: 4,
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
  sectionCard: {
    margin: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  resultBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gameRating: {
    alignItems: 'flex-end',
  },
  ratingChange: {
    fontSize: 16,
    fontWeight: '600',
  },
  achievements: {
    gap: 12,
  },
  achievementCard: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 20,
  },
  actionButton: {
    flex: 1,
    maxWidth: 150,
  },
});
