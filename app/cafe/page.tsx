'use client';

import { ZoneCanvas } from '@/components/ZoneCanvas';

export default function CafePage() {
  return (
    <div className="h-screen">
      <ZoneCanvas
        zone="notebook"
        characters={[
          { id: '1', nickname: '본인', isSelf: true, appearance: { mugColor: 'orange', accessory: 'glasses' } },
        ]}
      />
    </div>
  );
}