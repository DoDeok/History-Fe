import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
    try {
        const { user_id, email, display_name } = await request.json();

        if (!user_id) {
            return NextResponse.json(
                { message: 'User ID is required' },
                { status: 400 }
            );
        }

        // Generate JWT
        const token = await signToken({
            userId: user_id,
            email: email || null,
            user_id: display_name || user_id,
        });

        // Create response with JWT in HttpOnly cookie
        const response = NextResponse.json({
            message: 'OAuth callback successful',
            user: {
                id: user_id,
                email: email || null,
                user_id: display_name || user_id,
            },
        });

        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('OAuth callback error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
