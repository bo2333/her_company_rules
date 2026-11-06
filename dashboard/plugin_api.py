import json, os
from fastapi import APIRouter
from pydantic import BaseModel, Field, field_validator
from typing import Any, Dict, List, Optional

router = APIRouter()

HERE = os.path.dirname(os.path.abspath(__file__))
CONFIG_DIR = os.path.join(HERE, "config")


def _read_json(path: str, default: Any = None) -> Any:
    if not os.path.exists(path):
        return default
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (OSError, json.JSONDecodeError):
        return default


def _write_json(path: str, data: Any) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


CONSTANTS = _read_json(os.path.join(CONFIG_DIR, "constants.json"), {}) or {}
LIMITS = CONSTANTS.get("limits", {}) or {}
NAV_ID_PATTERN = CONSTANTS.get("navIdPattern", r"^navbar_main_\d+$")
NAME_MAX = int(LIMITS.get("nameLength", 64))
DESC_MAX = int(LIMITS.get("descriptionLength", 256))
NAV_ITEMS_MAX = int(LIMITS.get("navItems", 50))

DATA_DIR = os.path.join(
    os.path.expanduser("~/.hermes/plugin-data"),
    CONSTANTS.get("dataDir", "her_company_rules"),
)
DATA_PATH = os.path.join(DATA_DIR, "nav_config.json")


class NavItem(BaseModel):
    id: str = Field(..., pattern=NAV_ID_PATTERN)
    name: str = Field(..., min_length=1, max_length=NAME_MAX)
    description: Optional[str] = Field("", max_length=DESC_MAX)

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("name 不能为空")
        return v.strip()


class NavConfig(BaseModel):
    items: List[NavItem] = Field(..., max_length=NAV_ITEMS_MAX)
    appearance: Optional[Dict[str, Any]] = None


class InstallRequest(BaseModel):
    url: str = Field(..., min_length=1)
    navId: str = Field(..., pattern=NAV_ID_PATTERN)


@router.get("/constants")
async def get_constants() -> Dict[str, Any]:
    return CONSTANTS


@router.get("/ui-config")
async def get_ui_config() -> Dict[str, Any]:
    return _read_json(os.path.join(CONFIG_DIR, "ui.json"), {})


@router.get("/nav-config")
async def get_nav_config() -> Dict[str, Any]:
    saved = _read_json(DATA_PATH)
    if saved is not None:
        return saved
    return _read_json(os.path.join(CONFIG_DIR, "defaults.json"), {"items": [], "appearance": {}})


@router.put("/nav-config")
async def update_nav_config(config: NavConfig) -> Dict[str, Any]:
    _write_json(DATA_PATH, config.model_dump())
    return {"ok": True}


@router.post("/install")
async def install_plugin(req: InstallRequest) -> Dict[str, Any]:
    # 此处编写实际的安装逻辑：
    # 下载 req.url，子插件自行通过 registerSubNav 注册名字和内容
    print(f"[her_company_rules] 收到安装请求: {req.url} -> {req.navId}")
    return {"ok": True, "message": "安装任务已下发"}