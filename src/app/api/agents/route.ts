import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Agent } from '@/types';

// GET /api/agents - Get all agents
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching agents:', error);
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

// POST /api/agents - Create a new agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.model) {
      return NextResponse.json(
        { error: 'Name and model are required' },
        { status: 400 }
      );
    }

    // Create default configuration if not provided
    const agentData = {
      name: body.name,
      description: body.description || '',
      status: body.status || 'inactive',
      model: body.model,
      configuration: body.configuration || {
        prompt_template: '',
        temperature: 0.7,
        max_tokens: 1000,
        system_message: '',
        tools: [],
        metadata: {}
      }
    };

    const { data, error } = await supabase
      .from('agents')
      .insert(agentData)
      .select();

    if (error) {
      console.error('Error creating agent:', error);
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
