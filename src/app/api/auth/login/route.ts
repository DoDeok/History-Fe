import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { comparePassword } from '@/lib/password';
import { signToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
    try {
        const { user_id, password } = await request.json();

        // Validate input
        if (!user_id || !password) {
            return NextResponse.json(
                { message: 'User ID and password are required' },
                { status: 400 }
            );
        }

        // Find user by user_id
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', user_id)
            .single();

        if (error || !user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check if password exists (local user)
        if (!user.password) {
            return NextResponse.json(
                { message: 'This account uses OAuth login' },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate JWT
        const token = await signToken({
            userId: user.id,
            email: null,
            user_id: user.user_id,
        });

        // Create response with JWT in HttpOnly cookie
        const response = NextResponse.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: null,
                user_id: user.user_id,
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
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
