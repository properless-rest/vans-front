
import { 
    BarChart, Bar, 
    XAxis, YAxis, 
    CartesianGrid, Tooltip, 
    ResponsiveContainer 
} from 'recharts';


export default function TransactionsChart({ data, xKey }) {
    const dataIsDefault = data.isDefault
    return(
        // TODO: switch to .css
        <ResponsiveContainer className="chart-box" height={300} >
            <BarChart data={data} layout="horizontal">
                <CartesianGrid strokeDasharray="5 5 5" />
                <XAxis 
                    dataKey={xKey} 
                    tickSize={12} 
                    style={{ fontWeight: 500 }} 
                />
                <YAxis 
                    domain={dataIsDefault ? [0, 1000] : [0, 'auto']}
                    unit="$" 
                    style={{ fontWeight: 500 }} 
                    width={65} 
                    padding={{ top: 10 }} 
                />
                <Tooltip />
                <Bar unit="$" dataKey="income" fill="#FF974B" />
            </BarChart>
        </ResponsiveContainer>
    )
}
