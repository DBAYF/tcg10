import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Services
import localStorage from '../services/localStorage';

// Components
import Header from '../components/common/Header';

// Types
import { TCGCard } from '../services/tcgApis';

// Constants
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants';

interface SocialPost {
  id: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  content: string;
  images?: string[];
  type: 'text' | 'deck' | 'card' | 'tournament';
  relatedDeck?: {
    id: string;
    name: string;
    game: string;
    cardCount: number;
  };
  relatedCard?: TCGCard;
  likes: number;
  comments: Comment[];
  createdAt: string;
  isLiked?: boolean;
}

interface Comment {
  id: string;
  author: {
    id: string;
    username: string;
    displayName: string;
  };
  content: string;
  createdAt: string;
}

const SocialFeedScreen: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.auth.user);

  // State
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPostType, setSelectedPostType] = useState<'text' | 'deck' | 'card'>('text');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const storedPosts = await localStorage.getSocialPosts();

      // If no posts exist, create some sample posts
      if (storedPosts.length === 0) {
        const samplePosts = generateSamplePosts();
        await localStorage.saveSocialPosts(samplePosts);
        setPosts(samplePosts);
      } else {
        setPosts(storedPosts);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      Alert.alert('Error', 'Failed to load social feed');
    } finally {
      setLoading(false);
    }
  };

  const generateSamplePosts = (): SocialPost[] => {
    const now = new Date();
    return [
      {
        id: 'post-1',
        author: {
          id: 'user-1',
          username: 'cardmaster',
          displayName: 'Card Master',
        },
        content: 'Just built an amazing control deck for Standard! Loving the new meta. Who else is playing control?',
        type: 'deck',
        relatedDeck: {
          id: 'deck-1',
          name: 'Azorius Control',
          game: 'mtg',
          cardCount: 60,
        },
        likes: 12,
        comments: [
          {
            id: 'comment-1',
            author: { username: 'spellslinger', displayName: 'Spell Slinger' },
            content: 'Looks solid! Have you tried the new counterspell?',
            createdAt: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), // 30 min ago
          },
        ],
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      },
      {
        id: 'post-2',
        author: {
          id: 'user-2',
          username: 'pokefan',
          displayName: 'Poké Fan',
        },
        content: 'Finally completed my Charizard collection! 🔥 Which Charizard variant is your favorite?',
        type: 'card',
        relatedCard: {
          id: 'card-charizard',
          name: 'Charizard',
          game: 'pokemon',
          imageUrl: 'https://example.com/charizard.jpg',
          price: 45.99,
        } as TCGCard,
        likes: 8,
        comments: [],
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      },
      {
        id: 'post-3',
        author: {
          id: 'user-3',
          username: 'yugiduelist',
          displayName: 'Yu-Gi Duelist',
        },
        content: 'Tournament tomorrow! My Blue-Eyes deck is ready. Wish me luck! 🐉',
        type: 'tournament',
        likes: 5,
        comments: [
          {
            id: 'comment-2',
            author: { username: 'cardmaster', displayName: 'Card Master' },
            content: 'Good luck! Blue-Eyes is always a classic choice.',
            createdAt: new Date(now.getTime() - 1000 * 60 * 15).toISOString(), // 15 min ago
          },
        ],
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      },
      {
        id: 'post-4',
        author: {
          id: 'user-4',
          username: 'tcgcollector',
          displayName: 'TCG Collector',
        },
        content: 'Market analysis: Lorcana prices are stabilizing after the recent hype. Good time to invest in key cards.',
        type: 'text',
        likes: 15,
        comments: [],
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      },
    ];
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      Alert.alert('Error', 'Please enter some content for your post');
      return;
    }

    try {
      const newPost: SocialPost = {
        id: `post-${Date.now()}`,
        author: {
          id: currentUser?.id || 'user-guest',
          username: currentUser?.username || 'guest',
          displayName: currentUser?.displayName || 'Guest User',
          avatar: currentUser?.avatarUrl,
        },
        content: newPostContent,
        type: selectedPostType,
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString(),
      };

      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      await localStorage.saveSocialPosts(updatedPosts);

      // Reset form
      setNewPostContent('');
      setShowCreatePost(false);
      setSelectedPostType('text');

      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post');
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          const newIsLiked = !post.isLiked;
          return {
            ...post,
            likes: newIsLiked ? post.likes + 1 : post.likes - 1,
            isLiked: newIsLiked,
          };
        }
        return post;
      });

      setPosts(updatedPosts);
      await localStorage.saveSocialPosts(updatedPosts);
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Error', 'Failed to like post');
    }
  };

  const handleAddComment = async (postId: string, commentContent: string) => {
    if (!commentContent.trim()) return;

    try {
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        author: {
          username: currentUser?.username || 'guest',
          displayName: currentUser?.displayName || 'Guest User',
        },
        content: commentContent,
        createdAt: new Date().toISOString(),
      };

      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      });

      setPosts(updatedPosts);
      await localStorage.saveSocialPosts(updatedPosts);
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  const renderPost = ({ item: post }: { item: SocialPost }) => (
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {post.author.displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.authorName}>{post.author.displayName}</Text>
            <Text style={styles.postTime}>{formatTimeAgo(post.createdAt)}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Related Content */}
      {post.relatedDeck && (
        <View style={styles.relatedContent}>
          <View style={styles.deckPreview}>
            <Ionicons name="layers-outline" size={24} color={COLORS.primary} />
            <View style={styles.deckInfo}>
              <Text style={styles.deckName}>{post.relatedDeck.name}</Text>
              <Text style={styles.deckMeta}>
                {post.relatedDeck.game.toUpperCase()} • {post.relatedDeck.cardCount} cards
              </Text>
            </View>
          </View>
        </View>
      )}

      {post.relatedCard && (
        <View style={styles.relatedContent}>
          <View style={styles.cardPreview}>
            {post.relatedCard.imageUrl ? (
              <Image source={{ uri: post.relatedCard.imageUrl }} style={styles.cardImage} />
            ) : (
              <View style={styles.cardPlaceholder}>
                <Ionicons name="image-outline" size={24} color={COLORS.text.secondary} />
              </View>
            )}
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{post.relatedCard.name}</Text>
              <Text style={styles.cardMeta}>
                {post.relatedCard.game.toUpperCase()} • ${post.relatedCard.price?.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLikePost(post.id)}
        >
          <Ionicons
            name={post.isLiked ? "heart" : "heart-outline"}
            size={20}
            color={post.isLiked ? '#EF4444' : COLORS.text.secondary}
          />
          <Text style={[styles.actionText, post.isLiked && { color: '#EF4444' }]}>
            {post.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color={COLORS.text.secondary} />
          <Text style={styles.actionText}>{post.comments.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={20} color={COLORS.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Comments */}
      {post.comments.length > 0 && (
        <View style={styles.commentsSection}>
          {post.comments.slice(0, 2).map(comment => (
            <View key={comment.id} style={styles.comment}>
              <Text style={styles.commentAuthor}>{comment.author.displayName}</Text>
              <Text style={styles.commentContent}>{comment.content}</Text>
              <Text style={styles.commentTime}>{formatTimeAgo(comment.createdAt)}</Text>
            </View>
          ))}
          {post.comments.length > 2 && (
            <Text style={styles.moreComments}>View all {post.comments.length} comments</Text>
          )}
        </View>
      )}
    </View>
  );

  const renderCreatePost = () => (
    <View style={styles.createPostCard}>
      <TextInput
        style={styles.postInput}
        placeholder="What's on your mind?"
        value={newPostContent}
        onChangeText={setNewPostContent}
        multiline
        maxLength={500}
      />

      <View style={styles.postTypeSelector}>
        {[
          { type: 'text', label: 'Text', icon: 'text-outline' },
          { type: 'deck', label: 'Deck', icon: 'layers-outline' },
          { type: 'card', label: 'Card', icon: 'card-outline' },
        ].map(({ type, label, icon }) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.postTypeButton,
              selectedPostType === type && styles.postTypeButtonActive
            ]}
            onPress={() => setSelectedPostType(type as any)}
          >
            <Ionicons
              name={icon as any}
              size={18}
              color={selectedPostType === type ? COLORS.surface.light : COLORS.primary}
            />
            <Text style={[
              styles.postTypeText,
              selectedPostType === type && styles.postTypeTextActive
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.createPostActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            setShowCreatePost(false);
            setNewPostContent('');
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.postButton, !newPostContent.trim() && styles.postButtonDisabled]}
          onPress={handleCreatePost}
          disabled={!newPostContent.trim()}
        >
          <Text style={[
            styles.postButtonText,
            !newPostContent.trim() && styles.postButtonTextDisabled
          ]}>
            Post
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Social Feed" showSearch={false} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading social feed...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Social Feed"
        showSearch={false}
        showNotifications={false}
        showMessages={false}
      />

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContainer}
        ListHeaderComponent={showCreatePost ? renderCreatePost : null}
        refreshControl={{
          refreshing,
          onRefresh: handleRefresh,
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={COLORS.text.secondary} />
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptySubtitle}>Be the first to share something!</Text>
          </View>
        }
      />

      {/* FAB for creating posts */}
      {!showCreatePost && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowCreatePost(true)}
        >
          <Ionicons name="add" size={24} color={COLORS.surface.light} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
  },
  feedContainer: {
    padding: SPACING.sm,
  },
  postCard: {
    backgroundColor: COLORS.surface.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  avatarText: {
    ...TYPOGRAPHY.body,
    color: COLORS.surface.light,
    fontWeight: '600',
  },
  authorName: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  postTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  postContent: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    lineHeight: 24,
    marginBottom: SPACING.sm,
  },
  relatedContent: {
    marginBottom: SPACING.sm,
  },
  deckPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.surface.dark,
  },
  deckInfo: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  deckName: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  deckMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  cardPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.surface.dark,
  },
  cardImage: {
    width: 50,
    height: 70,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
  },
  cardPlaceholder: {
    width: 50,
    height: 70,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surface.dark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  cardMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface.dark,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  actionText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  commentsSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.surface.dark,
    paddingTop: SPACING.sm,
  },
  comment: {
    marginBottom: SPACING.sm,
  },
  commentAuthor: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  commentContent: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.primary,
    marginTop: SPACING.xs,
  },
  commentTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  moreComments: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  createPostCard: {
    backgroundColor: COLORS.surface.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  postInput: {
    borderWidth: 1,
    borderColor: COLORS.surface.dark,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  postTypeSelector: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  postTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background.light,
    borderWidth: 1,
    borderColor: COLORS.surface.dark,
  },
  postTypeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  postTypeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  postTypeTextActive: {
    color: COLORS.surface.light,
  },
  createPostActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  cancelButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  cancelButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.text.secondary,
  },
  postButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  postButtonDisabled: {
    backgroundColor: COLORS.surface.dark,
  },
  postButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.surface.light,
  },
  postButtonTextDisabled: {
    color: COLORS.text.secondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyTitle: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.text.primary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default SocialFeedScreen;