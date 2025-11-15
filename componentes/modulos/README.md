# Módulos del Dashboard

Esta carpeta contiene componentes modulares reutilizables que se utilizan en el Dashboard.

## Estructura de Módulos

### Para Companies (role = 2)

#### **EntornoCard.tsx**
- Muestra la información del entorno de la compañía
- Contiene dos botones de acción:
  - "Cargar productos" (azul)
  - "Editar productos" (naranja)
- Props: `environmentName`, `onCargarProductos()`, `onEditarProductos()`

#### **ListaComprasCompany.tsx**
- Muestra la lista de compras registradas por clientes en el entorno
- Incluye: nombre del producto, precio, fecha/hora, y nombre del cliente
- Muestra hasta 10 compras, con indicador de "más" si hay adicionales
- Props: `registers[]` (array de compras con información del cliente)

---

### Para Clients (role = 1)

#### **EntornoUnidoCard.tsx**
- Muestra el entorno al que está unido el cliente
- Estilo visual verde para indicar unión exitosa
- Props: `environmentName`

#### **EstadisticasCliente.tsx**
- Módulo de estadísticas con dos tarjetas:
  - **Total Gastado**: Suma de precios de todas las compras (verde)
  - **Productos Comprados**: Cantidad total de productos (azul)
- Layout: dos tarjetas lado a lado
- Props: `registers[]` (calcula automáticamente las estadísticas)

#### **ListaComprasCliente.tsx**
- Lista de compras registradas por el cliente
- Muestra: nombre del producto, precio, fecha/hora
- Muestra hasta 5 compras, con indicador de "más" si hay adicionales
- Props: `registers[]`

---

## Uso

```tsx
import EntornoCard from '../../componentes/modulos/EntornoCard';
import EntornoUnidoCard from '../../componentes/modulos/EntornoUnidoCard';
import EstadisticasCliente from '../../componentes/modulos/EstadisticasCliente';
import ListaComprasCliente from '../../componentes/modulos/ListaComprasCliente';
import ListaComprasCompany from '../../componentes/modulos/ListaComprasCompany';

// Ejemplo para Companies
<EntornoCard
  environmentName={myEnvironments[0].name}
  onCargarProductos={() => setModalVisible(true)}
  onEditarProductos={() => setEditModalVisible(true)}
/>

// Ejemplo para Clients
<EntornoUnidoCard environmentName={joinedEnvironment.name} />
<EstadisticasCliente registers={myRegisters} />
<ListaComprasCliente registers={myRegisters} />
```

## Características

- **Componentes autónomos**: Cada módulo tiene sus propios estilos
- **TypeScript**: Tipos definidos para todas las props
- **Reutilizables**: Pueden usarse en otras partes de la aplicación
- **Mantenibles**: Código organizado y separado por funcionalidad
