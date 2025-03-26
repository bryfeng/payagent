import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';

// GET /api/events - Get all events
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.start_time) {
      return NextResponse.json(
        { error: 'Title and start time are required' },
        { status: 400 }
      );
    }

    // Create default values if not provided
    const eventData = {
      title: body.title,
      description: body.description || '',
      start_time: body.start_time,
      end_time: body.end_time || null,
      location: body.location || null,
      status: body.status || 'scheduled',
      priority: body.priority || 'medium',
      agent_id: body.agent_id || null,
      metadata: body.metadata || {}
    };

    const { data, error } = await supabase
      .from('events')
      .insert(eventData)
      .select();

    if (error) {
      console.error('Error creating event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
