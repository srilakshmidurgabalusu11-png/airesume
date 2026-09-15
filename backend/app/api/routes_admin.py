from fastapi import APIRouter
from ..core.telemetry import telemetry
from ..services.gemini_service import gemini_service
from ..models.schemas import AdminConfigUpdate

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/telemetry")
async def get_telemetry():
    return telemetry.get_metrics()

@router.post("/config")
async def update_config(config: AdminConfigUpdate):
    gemini_service.update_config(
        api_key=config.gemini_api_key,
        model_name=config.gemini_model
    )
    return {
        "status": "CONFIG_UPDATED",
        "active_model": gemini_service.model_name,
        "api_key_configured": bool(gemini_service.api_key)
    }

@router.post("/reset")
async def reset_metrics():
    telemetry.__init__()
    return {"status": "TELEMETRY_RESET"}
