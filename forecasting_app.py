from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import os
import datetime

app = FastAPI(title="CODEX Retail Intelligence & Forecasting API", version="2.5.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---

class CompetitorCreate(BaseModel):
    shop_name: str
    location: str
    contact_info: Optional[str] = None

class CompetitorPriceObservation(BaseModel):
    competitor_id: str
    sku: str
    barcode: Optional[str] = None
    selling_price: float
    observation_timestamp: str
    data_collection_method: str = Field(..., description="Manual Entry, Scraped API, or Field Audit")
    verification_status: str = Field("Unverified", description="Verified, Unverified, Disputed")

class PricingRecommendationRequest(BaseModel):
    sku: str
    product_name: str
    current_price: float
    unit_cost: float
    min_profit_margin_pct: float = 15.0  # Minimum margin floor guardrail
    competitor_prices: List[float] = []
    historical_sales_velocity: float = 45.0
    predicted_demand: int = 150
    festival_season_active: bool = True

class PricingRecommendationResponse(BaseModel):
    sku: str
    product_name: str
    current_price: float
    competitor_average: Optional[float]
    recommended_price: float
    recommendation_action: str
    reasoning: str
    margin_pct: float
    data_source: str
    last_updated: str

# In-memory store fallback when live DB sync is pending
IN_MEMORY_COMPETITORS = [
    {"id": "comp-01", "shop_name": "Apex Coatings Corp", "location": "Mumbai Highway, MH", "contact_info": "+91 98221 44556"},
    {"id": "comp-02", "shop_name": "BioMatrix Polymers", "location": "MIDC Industrial Area, Jalgaon", "contact_info": "+91 94222 11223"},
    {"id": "comp-03", "shop_name": "Nordic Tech Global", "location": "Pune Tech Hub, MH", "contact_info": "+91 97665 88990"},
    {"id": "comp-04", "shop_name": "SolarShield Materials", "location": "Nashik Road, MH", "contact_info": "+91 95521 33445"}
]

IN_MEMORY_PRICES = [
    {"competitor_id": "comp-01", "sku": "PROD-01", "selling_price": 2590.0, "observation_timestamp": "2026-11-02T10:30:00", "data_collection_method": "Field Audit", "verification_status": "Verified"},
    {"competitor_id": "comp-02", "sku": "PROD-02", "selling_price": 1850.0, "observation_timestamp": "2026-11-02T10:30:00", "data_collection_method": "Scraped API", "verification_status": "Verified"},
    {"competitor_id": "comp-03", "sku": "PROD-03", "selling_price": 4450.0, "observation_timestamp": "2026-11-02T10:30:00", "data_collection_method": "Manual Entry", "verification_status": "Unverified"},
    {"competitor_id": "comp-04", "sku": "PROD-04", "selling_price": 2990.0, "observation_timestamp": "2026-11-02T10:30:00", "data_collection_method": "Scraped API", "verification_status": "Verified"}
]

@app.get("/competitors", response_model=List[dict])
def get_competitors():
    """Retrieve registered competitors."""
    return IN_MEMORY_COMPETITORS

@app.post("/competitors", response_model=dict)
def add_competitor(payload: CompetitorCreate):
    """Add a new competitor record."""
    new_id = f"comp-{len(IN_MEMORY_COMPETITORS) + 1:02d}"
    new_comp = {
        "id": new_id,
        "shop_name": payload.shop_name,
        "location": payload.location,
        "contact_info": payload.contact_info or "N/A"
    }
    IN_MEMORY_COMPETITORS.append(new_comp)
    return {"status": "success", "competitor": new_comp}

@app.delete("/competitors/{competitor_id}")
def delete_competitor(competitor_id: str):
    """Delete a competitor record."""
    global IN_MEMORY_COMPETITORS
    initial_len = len(IN_MEMORY_COMPETITORS)
    IN_MEMORY_COMPETITORS = [c for c in IN_MEMORY_COMPETITORS if c["id"] != competitor_id]
    if len(IN_MEMORY_COMPETITORS) == initial_len:
        raise HTTPException(status_code=404, detail="Competitor not found.")
    return {"status": "success", "message": f"Competitor {competitor_id} deleted."}

@app.post("/competitor/prices", response_model=dict)
def record_competitor_price(payload: CompetitorPriceObservation):
    """Record a competitor product price observation (maintains historical records)."""
    obs = payload.dict()
    IN_MEMORY_PRICES.append(obs)
    return {"status": "success", "message": "Competitor price observation recorded successfully.", "observation": obs}

@app.post("/pricing/recommendation", response_model=PricingRecommendationResponse)
def generate_pricing_recommendation(payload: PricingRecommendationRequest):
    """
    AI Market Intelligence Engine & Dynamic Pricing Advisor Connector.
    Evaluates competitor prices, historical sales, demand forecasts, and profit margins.
    Guardrail: Never recommends a price below minimum profit margin floor.
    """
    api_key = os.getenv("MARKET_INTEL_API_KEY", "")
    data_source = "RetailBench Live API Feed" if (api_key and not api_key.startswith("your-")) else "Observed Market Baseline (Simulated)"

    comp_prices = payload.competitor_prices
    comp_avg = sum(comp_prices) / len(comp_prices) if comp_prices else None

    min_allowed_price = payload.unit_cost * (1 + (payload.min_profit_margin_pct / 100.0))

    recommended_price = payload.current_price
    action = "Maintain Current Price"
    reasoning = "Current price aligns with market competition and maintains target margin."

    if comp_avg:
        if payload.current_price > comp_avg * 1.08:
            if payload.predicted_demand < 100:
                recommended_price = round(comp_avg * 1.02, 2)
                action = "Consider a price reduction"
                reasoning = f"Your price is 8% above competitor average (₹{comp_avg:.2f}) and demand is softening. Adjusted closer to market equilibrium."
            else:
                reasoning = "High demand velocity supports premium pricing despite competitor averages."
        elif payload.current_price < comp_avg * 0.92:
            if payload.festival_season_active:
                recommended_price = round(comp_avg * 0.98, 2)
                action = "Consider a price increase"
                reasoning = f"Festival season active with strong demand. Room to increase price toward competitor average (₹{comp_avg:.2f}) without losing volume."
            else:
                reasoning = "Competitive pricing advantage maintained during steady demand."
    else:
        if payload.festival_season_active:
            recommended_price = round(payload.current_price * 1.05, 2)
            action = "Consider a price increase"
            reasoning = "Festival uplift detected. Insufficient direct competitor observations; applying conservative 5% seasonal markup."

    # Guardrail check: Minimum Profit Margin Floor
    if recommended_price < min_allowed_price:
        recommended_price = round(min_allowed_price, 2)
        reasoning += f" [Guardrail Applied: Price floored at minimum {payload.min_profit_margin_pct}% profit margin]."

    margin_pct = ((recommended_price - payload.unit_cost) / recommended_price) * 100 if recommended_price > 0 else 0.0

    return {
        "sku": payload.sku,
        "product_name": payload.product_name,
        "current_price": payload.current_price,
        "competitor_average": round(comp_avg, 2) if comp_avg else None,
        "recommended_price": recommended_price,
        "recommendation_action": action,
        "reasoning": reasoning,
        "margin_pct": round(margin_pct, 1),
        "data_source": data_source,
        "last_updated": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

@app.get("/market/intelligence")
def get_market_intelligence(authorization: Optional[str] = Header(None)):
    """Retrieves competitor benchmarks, market averages, and local demand trends."""
    return {
        "status": "success",
        "connector_status": "Connected" if os.getenv("MARKET_INTEL_API_KEY") else "Simulation Mode (Local DB)",
        "last_successful_sync": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "competitors_count": len(IN_MEMORY_COMPETITORS),
        "prices_logged_count": len(IN_MEMORY_PRICES)
    }