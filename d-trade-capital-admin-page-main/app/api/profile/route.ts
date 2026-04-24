import { NextResponse } from 'next/server';
import { getUserProfile, updateUserProfile, getLeaderboard } from '@/lib/db';
import { awardPoints } from '@/lib/points';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'usr_123';
    const action = searchParams.get('action'); // 'profile' | 'leaderboard' | 'stats'

    if (action === 'leaderboard') {
      const limit = parseInt(searchParams.get('limit') || '10');
      const leaderboard = await getLeaderboard(limit);

      // Add rank to each profile
      const rankedLeaderboard = leaderboard.map((profile, index) => ({
        ...profile,
        rank: index + 1
      }));

      return NextResponse.json(rankedLeaderboard);
    }

    const profile = await getUserProfile(userId);
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch profile', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId = 'usr_123', action, updates, streakActive = true } = body;

    let updatedProfile;

    if (action) {
      // Award points for an action
      const validActions = ['lesson_completed', 'quiz_passed', 'post_created', 'answer_upvoted', 'stage_completed', 'streak_maintained'];

      if (!validActions.includes(action)) {
        return NextResponse.json(
          { error: `Invalid action. Must be one of: ${validActions.join(', ')}` },
          { status: 400 }
        );
      }

      updatedProfile = await awardPoints(userId, action as any, streakActive);
    } else if (updates) {
      // Update profile directly (display name, avatar, etc.)
      updatedProfile = await updateUserProfile(userId, updates);
    } else {
      return NextResponse.json(
        { error: 'No action or updates provided' },
        { status: 400 }
      );
    }

    if (!updatedProfile) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 400 }
      );
    }

    return NextResponse.json(updatedProfile);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update profile', details: String(error) },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
