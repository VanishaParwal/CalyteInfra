# Design Guidelines for Calyte Mental Wellness App

## User Directive: Preserve Existing Frontend

**Critical Constraint**: The user has explicitly requested to "keep the frontend same i.e. the client part" and maintain "the frontend and its layout exactly same."

Therefore, **no new design guidelines are required**. The existing frontend from the Calyte repository (https://github.com/swastii4/Calyte.git) should be preserved in its current state.

## Implementation Approach

**Frontend Preservation**:
- Clone the existing repository and maintain all React components as-is
- Preserve all existing layouts, styling, component structures, and user flows
- Keep all current design elements: typography, spacing, color schemes, animations
- Maintain existing component library and UI patterns

**Backend-Only Modifications**:
- All changes are isolated to the backend architecture
- API endpoints should maintain compatibility with existing frontend contracts
- Response formats must match what the current frontend expects
- Authentication flow should integrate seamlessly with existing login/signup components

**Key Preservation Areas**:
- Existing playlist.tsx audio player UI (backend will fix audio source handling)
- Current therapy chat interface (backend will integrate Chatbase AI)
- Existing game UIs for mood tracking, meditation, breathing exercises
- Current dashboard, navigation, and user profile layouts
- All existing form designs and validation UI

**India-Focused Content Integration**:
- Backend will populate MongoDB with India-focused mock data
- Frontend displays this data using existing component patterns
- No UI changes needed - only data source changes from PostgreSQL to MongoDB

This approach ensures zero disruption to the user experience while the entire backend infrastructure is rebuilt for production-grade scalability.