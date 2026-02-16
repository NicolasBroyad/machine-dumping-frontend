import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BarcodeScannerModal from "../../componentes/BarcodeScannerModal";
import CargarProductosModal from "../../componentes/CargarProductosModal";
import ConfirmarProductoModal from "../../componentes/ConfirmarProductoModal";
import CrearEntornoModal from "../../componentes/CrearEntornoModal";
import EditarProductosModal from "../../componentes/EditarProductosModal";
import EntornoCard from "../../componentes/modulos/EntornoCard";
import EntornoUnidoCard from "../../componentes/modulos/EntornoUnidoCard";
import EstadisticasCliente from "../../componentes/modulos/EstadisticasCliente";
import EstadisticasCompany from "../../componentes/modulos/EstadisticasCompany";
import ListaComprasCliente from "../../componentes/modulos/ListaComprasCliente";
import ListaComprasCompany from "../../componentes/modulos/ListaComprasCompany";
import ProductoFavorito from "../../componentes/modulos/ProductoFavorito";
import RankingCliente from "../../componentes/modulos/RankingCliente";
import ProductoFavoritoDetalleModal from "../../componentes/ProductoFavoritoDetalleModal";
import RankingClientesCompanyModal from "../../componentes/RankingClientesCompanyModal";
import RankingDetalleModal from "../../componentes/RankingDetalleModal";
import RankingProductosCompanyModal from "../../componentes/RankingProductosCompanyModal";
import RecaudadoPorDiaModal from "../../componentes/RecaudadoPorDiaModal";
import TotalGastadoDetalleModal from "../../componentes/TotalGastadoDetalleModal";
import UnirseEntornoModal from "../../componentes/UnirseEntornoModal";
import { API_ENDPOINTS } from "../../config/api";

import {
    BorderRadius,
    Colors,
    Shadows,
    Spacing,
    Typography,
} from "../../constants/theme";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const raw = await AsyncStorage.getItem("usuario");
        if (raw) {
          const usuario = JSON.parse(raw);
          // Esperamos que el objeto tenga la propiedad `role` numérica (1=Cliente, 2=Vendedor/Company)
          setRole(usuario.role ?? null);
        }
      } catch (e) {
        console.error("Error leyendo usuario desde AsyncStorage", e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const [myEnvironments, setMyEnvironments] = useState<
    { id: number; name: string }[]
  >([]);
  const [joinedEnvironments, setJoinedEnvironments] = useState<
    { id: number; name: string; companyName?: string; points?: number }[]
  >([]);
  const [myRegisters, setMyRegisters] = useState<
    {
      id: number;
      datetime: string;
      price: number;
      product: { name: string; price: number };
      environment: { name: string };
    }[]
  >([]);
  const [companyRegisters, setCompanyRegisters] = useState<
    {
      id: number;
      datetime: string;
      price: number;
      product: { name: string; price: number };
      client: { user: { username: string; email: string } };
    }[]
  >([]);

  const [companyStatistics, setCompanyStatistics] = useState<{
    totalRecaudado: number;
    cantidadVendidos: number;
    productoMasComprado: { name: string; count: number; price: number } | null;
    mayorComprador: { username: string; total: number; compras: number } | null;
  } | null>(null);

  const [clientStatistics, setClientStatistics] = useState<{
    productoFavorito: { name: string; count: number; price: number } | null;
    rankingPosicion: {
      posicion: number;
      totalParticipantes: number;
      total: number;
    } | null;
  } | null>(null);

  // Estado para el selector de entornos (Clientes)
  const [selectedEnvironment, setSelectedEnvironment] = useState<{
    id: number;
    name: string;
    companyName?: string;
    points?: number;
  } | null>(null);
  const [envDropdownOpen, setEnvDropdownOpen] = useState(false);

  // Estado para el selector de entornos (Companies)
  const [selectedCompanyEnv, setSelectedCompanyEnv] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [companyEnvDropdownOpen, setCompanyEnvDropdownOpen] = useState(false);

  const fetchMyEnvironments = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(API_ENDPOINTS.ENVIRONMENTS_MINE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMyEnvironments(data || []);
        // Seleccionar el primer entorno automáticamente si no hay ninguno seleccionado
        if (data && data.length > 0 && !selectedCompanyEnv) {
          setSelectedCompanyEnv(data[0]);
        }
      } else {
        console.warn("No se pudieron obtener environments");
      }
    } catch (e) {
      console.error("Error fetching environments", e);
    }
  }, [selectedCompanyEnv]);

  const fetchJoinedEnvironments = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(API_ENDPOINTS.ENVIRONMENTS_JOINED, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const envs = data.environments || [];
        setJoinedEnvironments(envs);
        // Seleccionar el primer entorno automáticamente si no hay ninguno seleccionado
        if (envs.length > 0 && !selectedEnvironment) {
          setSelectedEnvironment(envs[0]);
        }
      } else {
        console.warn("No se pudieron obtener los entornos unidos");
      }
    } catch (e) {
      console.error("Error fetching joined environments", e);
    }
  }, [selectedEnvironment]);

  const fetchMyRegisters = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(API_ENDPOINTS.REGISTERS_MINE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMyRegisters(data || []);
      } else {
        console.warn("No se pudieron obtener los registros");
      }
    } catch (e) {
      console.error("Error fetching registers", e);
    }
  }, []);

  const fetchCompanyRegisters = useCallback(async (environmentId?: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const url = environmentId
        ? API_ENDPOINTS.REGISTERS_COMPANY_BY_ENV(environmentId)
        : API_ENDPOINTS.REGISTERS_COMPANY;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCompanyRegisters(data || []);
      } else {
        console.warn("No se pudieron obtener los registros de la company");
      }
    } catch (e) {
      console.error("Error fetching company registers", e);
    }
  }, []);

  const fetchCompanyStatistics = useCallback(async (environmentId?: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const url = environmentId
        ? API_ENDPOINTS.STATISTICS_COMPANY_BY_ENV(environmentId)
        : API_ENDPOINTS.STATISTICS_COMPANY;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCompanyStatistics(data);
      } else {
        console.warn("No se pudieron obtener las estadísticas");
      }
    } catch (e) {
      console.error("Error fetching company statistics", e);
    }
  }, []);

  const fetchClientStatistics = useCallback(async (environmentId?: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const url = environmentId
        ? API_ENDPOINTS.STATISTICS_CLIENT_BY_ENV(environmentId)
        : API_ENDPOINTS.STATISTICS_CLIENT;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setClientStatistics(data);
      } else {
        console.warn("No se pudieron obtener las estadísticas del cliente");
      }
    } catch (e) {
      console.error("Error fetching client statistics", e);
    }
  }, []);

  useEffect(() => {
    if (role === 2) {
      fetchMyEnvironments();
      // Los registros y estadísticas se cargarán cuando selectedCompanyEnv se establezca
    } else if (role === 1) {
      fetchJoinedEnvironments();
      fetchMyRegisters();
    }
  }, [role, fetchMyEnvironments, fetchJoinedEnvironments, fetchMyRegisters]);

  // Recargar estadísticas cuando cambie el entorno seleccionado (Cliente)
  useEffect(() => {
    if (role === 1 && selectedEnvironment) {
      fetchClientStatistics(selectedEnvironment.id);
    }
  }, [selectedEnvironment, role, fetchClientStatistics]);

  // Recargar estadísticas y registros cuando cambie el entorno seleccionado (Company)
  useEffect(() => {
    if (role === 2 && selectedCompanyEnv) {
      console.log(
        "Cambiando a entorno:",
        selectedCompanyEnv.id,
        selectedCompanyEnv.name,
      );
      fetchCompanyRegisters(selectedCompanyEnv.id);
      fetchCompanyStatistics(selectedCompanyEnv.id);
    }
  }, [selectedCompanyEnv?.id, role]);

  // Refrescar registros cuando la pantalla vuelva a estar en foco
  useFocusEffect(
    useCallback(() => {
      if (role === 1) {
        fetchMyRegisters();
        if (selectedEnvironment) {
          fetchClientStatistics(selectedEnvironment.id);
        }
      } else if (role === 2 && selectedCompanyEnv) {
        fetchCompanyRegisters(selectedCompanyEnv.id);
        fetchCompanyStatistics(selectedCompanyEnv.id);
      }
    }, [
      role,
      fetchMyRegisters,
      fetchClientStatistics,
      fetchCompanyRegisters,
      fetchCompanyStatistics,
      selectedEnvironment,
      selectedCompanyEnv,
    ]),
  );

  const handleCrear = () => {
    // Abrir modal para crear entorno en lugar de navegar
    setModalVisible(true);
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [unirseModalVisible, setUnirseModalVisible] = useState(false);
  const [cargarProductosVisible, setCargarProductosVisible] = useState(false);
  const [editarProductosVisible, setEditarProductosVisible] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [confirmarVisible, setConfirmarVisible] = useState(false);
  const [rankingDetalleVisible, setRankingDetalleVisible] = useState(false);
  const [productoFavoritoDetalleVisible, setProductoFavoritoDetalleVisible] =
    useState(false);
  const [totalGastadoDetalleVisible, setTotalGastadoDetalleVisible] =
    useState(false);
  // Estados para modales de Company
  const [rankingClientesCompanyVisible, setRankingClientesCompanyVisible] =
    useState(false);
  const [rankingProductosCompanyVisible, setRankingProductosCompanyVisible] =
    useState(false);
  const [recaudadoPorDiaVisible, setRecaudadoPorDiaVisible] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOpenScanner = () => {
    setCargarProductosVisible(false); // Cerrar el modal de productos temporalmente
    setScannerVisible(true);
  };

  const handleBarcodeScanned = (barcode: string) => {
    setScannerVisible(false);
    setScannedBarcode(barcode);
    setConfirmarVisible(true);
  };

  const handleConfirmProduct = async (name: string, price: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const environmentId = selectedCompanyEnv?.id || 0;

      const res = await fetch(API_ENDPOINTS.PRODUCTS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          price,
          barcode: scannedBarcode,
          environmentId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Producto creado", `${name} ha sido agregado al entorno`);
        setConfirmarVisible(false);
        setCargarProductosVisible(true); // Volver a abrir el modal de productos
        setRefreshTrigger((prev) => prev + 1); // Trigger refresh
      } else {
        Alert.alert("Error", data.message || "No se pudo crear el producto");
      }
    } catch (e) {
      console.error("Error creando producto", e);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  const handleCreateEntorno = (env: { id: number; name: string }) => {
    // Cuando el modal retorna, refrescar la lista y seleccionar el nuevo entorno
    setModalVisible(false);
    fetchMyEnvironments();
    // Seleccionar el nuevo entorno creado
    setSelectedCompanyEnv(env);
    Alert.alert("Entorno creado", `Nombre: ${env.name}`);
  };

  const handleUnirse = () => {
    setUnirseModalVisible(true);
  };

  const handleJoinEnvironment = (env: {
    id: number;
    name: string;
    companyName?: string;
    points?: number;
  }) => {
    setUnirseModalVisible(false);
    setJoinedEnvironments((prev) => [...prev, env]);
    // Refrescar estadísticas después de unirse
    fetchClientStatistics();
  };

  const handleLeaveEnvironment = async (environmentId: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(API_ENDPOINTS.LEAVE_ENVIRONMENT(environmentId), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        // Remover el entorno de la lista local
        const updatedEnvs = joinedEnvironments.filter(
          (env) => env.id !== environmentId,
        );
        setJoinedEnvironments(updatedEnvs);
        // Si el entorno eliminado era el seleccionado, seleccionar otro
        if (selectedEnvironment?.id === environmentId) {
          setSelectedEnvironment(
            updatedEnvs.length > 0 ? updatedEnvs[0] : null,
          );
        }
        Alert.alert("Éxito", "Has abandonado el entorno");
        // Refrescar estadísticas
        fetchClientStatistics();
      } else {
        const data = await res.json();
        Alert.alert("Error", data.message || "No se pudo abandonar el entorno");
      }
    } catch (e) {
      console.error("Error leaving environment", e);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={styles.scrollContainer}
      edges={["top", "left", "right"]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Dashboard</Text>

        {/* Selector de entornos para Companies */}
        {role === 2 && myEnvironments.length > 0 && (
          <View style={{ width: "100%" }}>
            <Text style={styles.sectionTitle}>
              Mis Entornos ({myEnvironments.length})
            </Text>

            {/* Selector desplegable */}
            <Pressable
              style={styles.envSelector}
              onPress={() => setCompanyEnvDropdownOpen(!companyEnvDropdownOpen)}
            >
              <View style={styles.envSelectorContent}>
                <Text style={styles.envSelectorText}>
                  {selectedCompanyEnv?.name || "Seleccionar entorno"}
                </Text>
              </View>
              <Text style={styles.dropdownArrow}>
                {companyEnvDropdownOpen ? "▲" : "▼"}
              </Text>
            </Pressable>

            {/* Modal de selección de entornos */}
            <Modal
              visible={companyEnvDropdownOpen}
              transparent
              animationType="fade"
              onRequestClose={() => setCompanyEnvDropdownOpen(false)}
            >
              <Pressable
                style={styles.envModalOverlay}
                onPress={() => setCompanyEnvDropdownOpen(false)}
              >
                <View style={styles.envModalContent}>
                  <View style={styles.envModalHeader}>
                    <Text style={styles.envModalTitle}>Seleccionar Entorno</Text>
                    <Pressable onPress={() => setCompanyEnvDropdownOpen(false)}>
                      <Text style={styles.envModalClose}>✕</Text>
                    </Pressable>
                  </View>
                  <ScrollView style={styles.envModalScroll}>
                    {myEnvironments.map((env) => (
                      <Pressable
                        key={env.id}
                        style={[
                          styles.envModalItem,
                          selectedCompanyEnv?.id === env.id &&
                            styles.envModalItemSelected,
                        ]}
                        onPress={() => {
                          setSelectedCompanyEnv(env);
                          setCompanyEnvDropdownOpen(false);
                        }}
                      >
                        <Text style={styles.envModalItemName}>{env.name}</Text>
                        {selectedCompanyEnv?.id === env.id && (
                          <Text style={styles.envModalItemCheck}>✓</Text>
                        )}
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              </Pressable>
            </Modal>

            {/* Card del entorno seleccionado */}
            {selectedCompanyEnv && (
              <EntornoCard
                environmentName={selectedCompanyEnv.name}
                onCargarProductos={() => setCargarProductosVisible(true)}
                onEditarProductos={() => setEditarProductosVisible(true)}
              />
            )}
          </View>
        )}

        {/* Estadísticas para Companies */}
        {role === 2 && companyStatistics && (
          <EstadisticasCompany
            statistics={companyStatistics}
            onTotalRecaudadoPress={() => setRecaudadoPorDiaVisible(true)}
            onProductoMasCompradoPress={() =>
              setRankingProductosCompanyVisible(true)
            }
            onMayorCompradorPress={() => setRankingClientesCompanyVisible(true)}
          />
        )}

        {/* Modales para Company */}
        <RankingClientesCompanyModal
          visible={rankingClientesCompanyVisible}
          onClose={() => setRankingClientesCompanyVisible(false)}
          environmentId={selectedCompanyEnv?.id || null}
        />
        <RankingProductosCompanyModal
          visible={rankingProductosCompanyVisible}
          onClose={() => setRankingProductosCompanyVisible(false)}
          environmentId={selectedCompanyEnv?.id || null}
        />
        <RecaudadoPorDiaModal
          visible={recaudadoPorDiaVisible}
          onClose={() => setRecaudadoPorDiaVisible(false)}
          environmentId={selectedCompanyEnv?.id || null}
        />

        {/* Selector de entornos para Clientes */}
        {role === 1 && joinedEnvironments.length > 0 && (
          <View style={{ width: "100%" }}>
            <Text style={styles.sectionTitle}>
              Mis Entornos ({joinedEnvironments.length})
            </Text>

            {/* Selector desplegable */}
            <Pressable
              style={styles.envSelector}
              onPress={() => setEnvDropdownOpen(!envDropdownOpen)}
            >
              <View style={styles.envSelectorContent}>
                <Text style={styles.envSelectorText}>
                  {selectedEnvironment?.name || "Seleccionar entorno"}
                </Text>
                {selectedEnvironment?.companyName && (
                  <Text style={styles.envSelectorSubtext}>
                    {selectedEnvironment.companyName}
                  </Text>
                )}
              </View>
              <View style={styles.envSelectorRight}>
                <Text style={styles.dropdownArrow}>
                  {envDropdownOpen ? "▲" : "▼"}
                </Text>
              </View>
            </Pressable>

            {/* Modal de selección de entornos */}
            <Modal
              visible={envDropdownOpen}
              transparent
              animationType="fade"
              onRequestClose={() => setEnvDropdownOpen(false)}
            >
              <Pressable
                style={styles.envModalOverlay}
                onPress={() => setEnvDropdownOpen(false)}
              >
                <View style={styles.envModalContent}>
                  <View style={styles.envModalHeader}>
                    <Text style={styles.envModalTitle}>Seleccionar Entorno</Text>
                    <Pressable onPress={() => setEnvDropdownOpen(false)}>
                      <Text style={styles.envModalClose}>✕</Text>
                    </Pressable>
                  </View>
                  <ScrollView style={styles.envModalScroll}>
                    {joinedEnvironments.map((env) => (
                      <Pressable
                        key={env.id}
                        style={[
                          styles.envModalItem,
                          selectedEnvironment?.id === env.id &&
                            styles.envModalItemSelected,
                        ]}
                        onPress={() => {
                          setSelectedEnvironment(env);
                          setEnvDropdownOpen(false);
                        }}
                      >
                        <View style={styles.envModalItemContent}>
                          <Text style={styles.envModalItemName}>{env.name}</Text>
                          {env.companyName && (
                            <Text style={styles.envModalItemCompany}>
                              {env.companyName}
                            </Text>
                          )}
                        </View>
                        <View style={styles.envModalItemRight}>
                          {selectedEnvironment?.id === env.id && (
                            <Text style={styles.envModalItemCheck}>✓</Text>
                          )}
                          <Pressable
                            style={styles.leaveButtonSmall}
                            onPress={(e) => {
                              e.stopPropagation();
                              Alert.alert(
                                "Abandonar entorno",
                                `¿Estás seguro de que deseas abandonar "${env.name}"?`,
                                [
                                  { text: "Cancelar", style: "cancel" },
                                  {
                                    text: "Abandonar",
                                    style: "destructive",
                                    onPress: () => handleLeaveEnvironment(env.id),
                                  },
                                ],
                              );
                            }}
                          >
                            <Text style={styles.leaveButtonSmallText}>✕</Text>
                          </Pressable>
                        </View>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              </Pressable>
            </Modal>

            {/* Card del entorno seleccionado */}
            {selectedEnvironment && (
              <EntornoUnidoCard
                environmentId={selectedEnvironment.id}
                environmentName={selectedEnvironment.name}
                companyName={selectedEnvironment.companyName}
                points={selectedEnvironment.points}
                onLeave={handleLeaveEnvironment}
              />
            )}
          </View>
        )}

        {/* Estadísticas para Clientes - filtradas por entorno */}
        {role === 1 &&
          selectedEnvironment &&
          myRegisters.filter(
            (r) => r.environment?.name === selectedEnvironment.name,
          ).length > 0 && (
            <EstadisticasCliente
              registers={myRegisters.filter(
                (r) => r.environment?.name === selectedEnvironment.name,
              )}
              onTotalGastadoPress={() => setTotalGastadoDetalleVisible(true)}
            />
          )}

        {/* Modal de Total Gastado Detallado */}
        <TotalGastadoDetalleModal
          visible={totalGastadoDetalleVisible}
          onClose={() => setTotalGastadoDetalleVisible(false)}
          environmentId={selectedEnvironment?.id || null}
        />

        {/* Producto Favorito del Cliente */}
        {role === 1 && clientStatistics && (
          <ProductoFavorito
            productoFavorito={clientStatistics.productoFavorito}
            onPress={() => setProductoFavoritoDetalleVisible(true)}
          />
        )}

        {/* Modal de Productos Favoritos Detallado */}
        <ProductoFavoritoDetalleModal
          visible={productoFavoritoDetalleVisible}
          onClose={() => setProductoFavoritoDetalleVisible(false)}
          environmentId={selectedEnvironment?.id || null}
        />

        {/* Ranking del Cliente */}
        {role === 1 && clientStatistics && (
          <RankingCliente
            ranking={clientStatistics.rankingPosicion}
            onPress={() => setRankingDetalleVisible(true)}
          />
        )}

        {/* Modal de Ranking Detallado */}
        <RankingDetalleModal
          visible={rankingDetalleVisible}
          onClose={() => setRankingDetalleVisible(false)}
          environmentId={selectedEnvironment?.id || null}
          miPosicion={clientStatistics?.rankingPosicion?.posicion}
        />

        {/* Registros de compras para Clientes - filtrados por entorno */}
        {role === 1 && selectedEnvironment && (
          <ListaComprasCliente
            registers={myRegisters.filter(
              (r) => r.environment?.name === selectedEnvironment.name,
            )}
          />
        )}

        {/* Registros de compras para Companies */}
        {role === 2 && <ListaComprasCompany registers={companyRegisters} />}

        {role === 2 ? (
          <>
            {/* Botón para crear más entornos */}
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleCrear}
              accessibilityLabel="Crear entorno"
            >
              <Text style={styles.buttonText}>
                {myEnvironments.length === 0
                  ? "Crear entorno"
                  : "+ Nuevo entorno"}
              </Text>
            </Pressable>
            <CrearEntornoModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onCreate={handleCreateEntorno}
            />
            <CargarProductosModal
              visible={cargarProductosVisible}
              onClose={() => setCargarProductosVisible(false)}
              environmentName={selectedCompanyEnv?.name || ""}
              environmentId={selectedCompanyEnv?.id || 0}
              onOpenScanner={handleOpenScanner}
              refreshTrigger={refreshTrigger}
            />
            <EditarProductosModal
              visible={editarProductosVisible}
              onClose={() => setEditarProductosVisible(false)}
              environmentName={selectedCompanyEnv?.name || ""}
              environmentId={selectedCompanyEnv?.id || 0}
            />
            <BarcodeScannerModal
              visible={scannerVisible}
              onClose={() => setScannerVisible(false)}
              onBarcodeScanned={handleBarcodeScanned}
            />
            <ConfirmarProductoModal
              visible={confirmarVisible}
              onClose={() => setConfirmarVisible(false)}
              barcode={scannedBarcode}
              onConfirm={handleConfirmProduct}
            />
          </>
        ) : (
          <>
            {/* Siempre mostrar botón para unirse a más entornos */}
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleUnirse}
              accessibilityLabel="Unirse a un entorno"
            >
              <Text style={styles.buttonText}>
                {joinedEnvironments.length === 0
                  ? "Unirse a un entorno"
                  : "Unirse a otro entorno"}
              </Text>
            </Pressable>
            <UnirseEntornoModal
              visible={unirseModalVisible}
              onClose={() => setUnirseModalVisible(false)}
              onJoin={handleJoinEnvironment}
              joinedEnvironmentIds={joinedEnvironments.map((e) => e.id)}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: Spacing.lg,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
    alignSelf: "flex-start",
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    marginTop: Spacing.lg,
    width: "100%",
    maxWidth: 320,
    ...Shadows.md,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    ...Typography.bodyBold,
    color: Colors.white,
    fontSize: 16,
  },
  sectionTitle: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  envSelector: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: Spacing.sm,
    ...Shadows.md,
  },
  envSelectorContent: {
    flex: 1,
  },
  envSelectorText: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  envSelectorSubtext: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  envSelectorRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  pointsBadgeSmall: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  pointsTextSmall: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: "600",
    fontSize: 12,
  },
  dropdownArrow: {
    color: Colors.primary,
    fontSize: 14,
    marginLeft: Spacing.sm,
  },
  envDropdown: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
    marginBottom: Spacing.md,
    maxHeight: 200,
    ...Shadows.lg,
  },
  envDropdownScroll: {
    maxHeight: 200,
  },
  envDropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  envDropdownItemSelected: {
    backgroundColor: Colors.surface,
  },
  envDropdownItemContent: {
    flex: 1,
  },
  envDropdownItemName: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  envDropdownItemCompany: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  envDropdownItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  envDropdownItemPoints: {
    ...Typography.caption,
    color: Colors.primary,
    marginRight: Spacing.sm,
  },
  leaveButtonSmall: {
    backgroundColor: "#FF5252",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Spacing.sm,
  },
  leaveButtonSmallText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  // Estilos para modal de selección de entornos
  envModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  envModalContent: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    width: "100%",
    maxWidth: 400,
    maxHeight: "70%",
    ...Shadows.lg,
  },
  envModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  envModalTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  envModalClose: {
    fontSize: 20,
    color: Colors.textSecondary,
    padding: Spacing.sm,
  },
  envModalScroll: {
    maxHeight: 400,
  },
  envModalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  envModalItemSelected: {
    backgroundColor: Colors.surface,
  },
  envModalItemContent: {
    flex: 1,
  },
  envModalItemName: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  envModalItemCompany: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  envModalItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  envModalItemCheck: {
    fontSize: 18,
    color: Colors.success,
    marginRight: Spacing.sm,
  },
});
