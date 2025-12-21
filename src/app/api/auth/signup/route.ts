import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { hashPassword } from '@/lib/password';
import { signToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { email, password, user_id } = await request.json();

    // Validate input
    if (!password || !user_id) {
      return NextResponse.json(
        { message: 'Password and user_id are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user in database
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        user_id,
        password: hashedPassword,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !newUser) {
      console.error('Signup error:', error);
      return NextResponse.json(
        { message: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Generate JWT
    const token = await signToken({
      userId: newUser.id,
      email: email || null,
      user_id: newUser.user_id,
    });

    // Create response with JWT in HttpOnly cookie
    const response = NextResponse.json({
      message: 'Signup successful',
      user: {
        id: newUser.id,
        email: email || null,
        user_id: newUser.user_id,
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
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
