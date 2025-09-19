// src/components/SalesCharts.js
import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const SalesCharts = () => {
  const [salesData, setSalesData] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Cargar datos de ventas
  useEffect(() => {
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    setSalesData(sales);
  }, []);

  // Filtrar ventas por rango de fechas
  const filteredSales = salesData.filter(sale => {
    return sale.date >= dateRange.start && sale.date <= dateRange.end;
  });

  // Calcular ventas por categoría
  const salesByCategory = filteredSales.reduce((acc, sale) => {
    sale.items.forEach(item => {
      // Determinar categoría basada en el nombre del producto
      let category = 'Otros';
      const productName = item.nombreProducto?.toLowerCase() || '';
      
      if (productName.includes('anillo')) category = 'Anillos';
      else if (productName.includes('arete')) category = 'Aretes';
      else if (productName.includes('brazalete')) category = 'Brazaletes';
      else if (productName.includes('aro') && !productName.includes('arete')) category = 'Aros';
      else if (productName.includes('collar')) category = 'Collares';

      if (!acc[category]) {
        acc[category] = { quantity: 0, revenue: 0 };
      }
      acc[category].quantity += item.quantity;
      acc[category].revenue += item.precio * item.quantity;
    });
    return acc;
  }, {});

  // Preparar datos para gráficos
  const categories = Object.keys(salesByCategory);
  const quantities = categories.map(cat => salesByCategory[cat].quantity);
  const revenues = categories.map(cat => salesByCategory[cat].revenue);

  // Datos para gráfico de barras (ventas por categoría)
  const barChartData = {
    labels: categories,
    datasets: [
      {
        label: 'Cantidad Vendida',
        data: quantities,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Ingresos (S/)',
        data: revenues,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  // Datos para gráfico circular (distribución de ingresos)
  const pieChartData = {
    labels: categories,
    datasets: [
      {
        data: revenues,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ]
      }
    ]
  };

  // Calcular ventas por día para gráfico de línea
  const salesByDay = filteredSales.reduce((acc, sale) => {
    if (!acc[sale.date]) {
      acc[sale.date] = 0;
    }
    acc[sale.date] += sale.total;
    return acc;
  }, {});

  const sortedDates = Object.keys(salesByDay).sort();
  const lineChartData = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Ingresos Diarios (S/)',
        data: sortedDates.map(date => salesByDay[date]),
        fill: false,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.1
      }
    ]
  };

  // Calcular totales
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalItems = filteredSales.reduce((sum, sale) => 
    sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

  return (
    <div className="sales-charts">
      <div className="charts-header">
        <h2>Análisis de Ventas</h2>
        
        <div className="date-filters">
          <div className="filter-group">
            <label>Rango de Fechas:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
            <span>a</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="sales-summary">
        <div className="summary-card">
          <h3>Total Vendido</h3>
          <p className="amount">S/ {totalRevenue.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Productos Vendidos</h3>
          <p className="amount">{totalItems}</p>
        </div>
        <div className="summary-card">
          <h3>N° de Ventas</h3>
          <p className="amount">{filteredSales.length}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Ventas por Categoría</h3>
          <Bar 
            data={barChartData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Comparación de Ventas por Categoría'
                }
              }
            }}
          />
        </div>

        <div className="chart-container">
          <h3>Distribución de Ingresos</h3>
          <Pie 
            data={pieChartData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                }
              }
            }}
          />
        </div>

        <div className="chart-container full-width">
          <h3>Evolución de Ingresos</h3>
          <Line 
            data={lineChartData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Tendencia de Ingresos por Día'
                }
              }
            }}
          />
        </div>
      </div>

      <div className="sales-details">
        <h3>Detalles de Ventas ({filteredSales.length} ventas)</h3>
        {filteredSales.length === 0 ? (
          <p>No hay ventas en el rango de fechas seleccionado.</p>
        ) : (
          <div className="sales-table">
            <table>
              <thead>
                <tr>
                  <th>Orden ID</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Productos</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map(sale => (
                  <tr key={sale.orderId}>
                    <td>{sale.orderId}</td>
                    <td>{new Date(sale.datetime).toLocaleDateString()}</td>
                    <td>{sale.customerInfo.nombre}</td>
                    <td>
                      {sale.items.map(item => (
                        <div key={item.idProducto}>
                          {item.nombreProducto} (x{item.quantity})
                        </div>
                      ))}
                    </td>
                    <td>S/ {sale.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesCharts;