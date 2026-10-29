import { NextRequest, NextResponse } from 'next/server';
import { updateServerIncidentAction, MOCK_USERS } from '@/lib/serverData';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, username } = body;

    const matchedUser = username ? MOCK_USERS[username]?.user : null;
    const role = matchedUser?.role || body.role;

    // Enforce role authorization
    if (role === 'dio_desk') {
      return NextResponse.json(
        {
          success: false,
          message: 'Permission Denied: District Collector or DG State Admin clearance required to authorize official government rebuttals.',
        },
        { status: 403 }
      );
    }

    if (!['authorize', 'issue_advisory', 'request_edits'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'Invalid action type.' },
        { status: 400 }
      );
    }

    const updated = updateServerIncidentAction(
      id,
      action as 'authorize' | 'issue_advisory' | 'request_edits',
      matchedUser || {
        id: 'collector',
        username: 'collector_palghar',
        name: 'Vikram S. Mahajan, IAS',
        marathiName: 'विक्रम एस. महाजन',
        role: 'collector',
        designation: 'Collector',
        division: 'Konkan',
        district: 'Palghar',
        avatarInitials: 'VM',
        permittedDivisions: ['Konkan'],
        permittedDistricts: ['Palghar'],
        canAuthorizeRebuttals: true,
      }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Incident not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        action === 'authorize'
          ? 'Rebuttal authorized and dispatched successfully.'
          : action === 'issue_advisory'
          ? 'Press advisory issued to media houses.'
          : 'Returned to DIO for field edits.',
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error updating incident.', error: String(error) },
      { status: 500 }
    );
  }
}
