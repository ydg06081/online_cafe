import { Character } from '@/components/Character';

export default function CafePage() {
  return (
    <div className="p-8 grid grid-cols-4 gap-6 bg-amber-100 min-h-screen">
      {(['red', 'blue', 'green', 'purple'] as const).map((c) =>
        (['none', 'beret', 'glasses', 'headphones'] as const).map((a) => (
          <Character key={`${c}-${a}`} appearance={{ mugColor: c, accessory: a }} />
        ))
      )}
    </div>
  );
}