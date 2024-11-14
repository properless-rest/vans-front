
import { roundNumber } from "../../../../utils/operations"


export default function Metric({ metric }) {
    const { rate, distribution } = metric
    const percentage = roundNumber(distribution * 100, 1)
    return(
        <div className="metric-group">
            <span className="rate">{rate} star{rate > 1 ? "s" : ""}</span>
            <div value={distribution} className="meter">
                <div 
                    className="fill"
                    style={{
                        position: "absolute",
                        width: `${percentage}%`,
                        height: "inherit",
                        borderRadius: "inherit",
                        backgroundColor: '#f39800'
                      }}
                >
                </div>
            </div>
            <span className="percentage">{percentage}%</span>
        </div>
    )
}
