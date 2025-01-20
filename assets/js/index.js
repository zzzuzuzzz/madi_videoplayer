import DB from "./DB.js"
import CardRender from "./CardRender.js";

const db = new DB();

db.loadAllData()
    .then(() => {
        const cardRenderer = new CardRender(db.db);
        cardRenderer.renderCards();
});