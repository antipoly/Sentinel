**Real-Time Hackathon**

**Technologies**
- Kafka
- PostgreSQL
- Svelte

**Topic:** Real-Time Disaster Alert Network

**Background:**
As a Small Island Developing Nation (SIDS), Jamaica is prone to critical environmental vulnerabilities due to its climate, geography and its surrounding environment. Disastrous events such as wildfires and floods needlessly cause loss of life due to the lack of mobilized emergency services.

Through this application, via a crowdsourced alert system, natural disasters such as earthquakes, floods and wildfires can be reported through a location based tracking system. Real-time websocket technology instantly pushes updates to a shared map for nearby users. Emergency responders can quickly mobilize and respond to the task at hand.

**Core Features:**
- User Authentication
  - Standard User
  - First Responder (Fire, EMS, Police)
  - Dispatch Services
- Report Submission
  - Witness
  - Geolocation
  - Emergency Type
- Live Map

<!-- First Responder live status -->
<!-- first responders assign themselves to a task -->
<!-- were people injured? -->

Emergency Types:
- Earthquake
- Wildfire
- Tsunami
- Adverse weather (hurricane)
- Flash flood
- Crime



**Models**
**User**
- id
- name
- age
- type (standard, dispatch, first responder)

**Report**
- geolocation
- type
- responders []
- timeframe (active status)
- live chat
- active status

<!-- if user is nearby the event then -->
<!-- they can be allowed to suggest edits -->
<!-- live chat -->
<!-- photos and video support -->