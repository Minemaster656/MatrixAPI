from typing import List

from routers.netcore import sessions

ACTIVE_SESSIONS: List[sessions.Session] = []
UNAUTHORIZED_SESSIONS: List[sessions.Session] = []
