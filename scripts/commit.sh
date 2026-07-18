#!/bin/bash
set -e
cd /home/team/shared/travl

# Check if on feature/reservation-flow, if not create it
CURRENT=$(git branch --show-current)
echo "Current branch: $CURRENT"

if [ "$CURRENT" != "feature/reservation-flow" ]; then
  git checkout -b feature/reservation-flow
  echo "Created new branch"
fi

# Add all new files  
git add app/reservation/ src/data/ src/components/ app/\(tabs\)/index.tsx

# Show status
git status --short

# Commit
git commit -m "feat: reservation creation flow with airport search, date picker, and passenger form

- Add 65+ international airport database with search
- Build 3-step reservation flow: airports → travel details → passenger
- Custom calendar date pickers for departure/return/DOB
- iOS-native search modal, segmented control, nationality picker
- Progress indicator with step labels
- Review screen with all reservation details
- Update home screen with premium design and navigation
- All form data persists in Zustand useReservationStore
- TypeScript compiles with zero errors (npx tsc --noEmit)"

echo "Commit done!"
