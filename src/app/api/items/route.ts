import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Item } from '@/types';

// GET /api/items - Get all items
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching items:', error);
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

// POST /api/items - Create a new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Create default values if not provided
    const itemData = {
      name: body.name,
      description: body.description || '',
      category: body.category || 'general',
      properties: body.properties || {},
      status: body.status || 'active',
    };

    const { data, error } = await supabase
      .from('items')
      .insert(itemData)
      .select();

    if (error) {
      console.error('Error creating item:', error);
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
