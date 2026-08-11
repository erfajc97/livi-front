/**
 * División política del Ecuador — 24 provincias y sus 221 cantones (INEC).
 *
 * Va quemado a propósito: son datos que cambian cada varios años, pesan poco y
 * así el formulario de direcciones no depende de la red ni de un tercero. El
 * selector es un buscador, no un `<select>` de 221 opciones, y además acepta un
 * valor escrito a mano para las localidades que no son cabecera cantonal.
 */
export interface EcuadorProvince {
  name: string;
  cantons: string[];
}

export const ECUADOR_PROVINCES: EcuadorProvince[] = [
  {
    name: 'Azuay',
    cantons: ['Camilo Ponce Enríquez', 'Chordeleg', 'Cuenca', 'El Pan', 'Girón', 'Guachapala', 'Gualaceo', 'Nabón', 'Oña', 'Paute', 'Pucara', 'San Fernando', 'Santa Isabel', 'Sevilla de Oro', 'Sigsig'],
  },
  {
    name: 'Bolívar',
    cantons: ['Caluma', 'Chillanes', 'Chimbo', 'Echeandía', 'Guaranda', 'Las Naves', 'San Miguel'],
  },
  {
    name: 'Cañar',
    cantons: ['Azogues', 'Biblián', 'Cañar', 'Déleg', 'El Tambo', 'La Troncal', 'Suscal'],
  },
  {
    name: 'Carchi',
    cantons: ['Bolívar', 'Espejo', 'Mira', 'Montúfar', 'San Pedro de Huaca', 'Tulcán'],
  },
  {
    name: 'Chimborazo',
    cantons: ['Alausi', 'Chambo', 'Chunchi', 'Colta', 'Cumandá', 'Guamote', 'Guano', 'Pallatanga', 'Penipe', 'Riobamba'],
  },
  {
    name: 'Cotopaxi',
    cantons: ['La Maná', 'Latacunga', 'Pangua', 'Pujili', 'Salcedo', 'Saquisilí', 'Sigchos'],
  },
  {
    name: 'El Oro',
    cantons: ['Arenillas', 'Atahualpa', 'Balsas', 'Chilla', 'El Guabo', 'Huaquillas', 'Las Lajas', 'Machala', 'Marcabelí', 'Pasaje', 'Piñas', 'Portovelo', 'Santa Rosa', 'Zaruma'],
  },
  {
    name: 'Esmeraldas',
    cantons: ['Atacames', 'Eloy Alfaro', 'Esmeraldas', 'La Concordia', 'Muisne', 'Quinindé', 'Rioverde', 'San Lorenzo'],
  },
  {
    name: 'Galápagos',
    cantons: ['Isabela', 'San Cristóbal', 'Santa Cruz'],
  },
  {
    name: 'Guayas',
    cantons: ['Alfredo Baquerizo Moreno (Juján)', 'Balao', 'Balzar', 'Colimes', 'Coronel Marcelino Maridueña', 'Daule', 'Durán', 'El Empalme', 'El Triunfo', 'General Antonio Elizalde', 'Guayaquil', 'Isidro Ayora', 'Lomas de Sargentillo', 'Milagro', 'Naranjal', 'Naranjito', 'Nobol', 'Palestina', 'Pedro Carbo', 'Playas', 'Salitre (Urbina Jado)', 'Samborondón', 'San Jacinto de Yaguachi', 'Santa Lucía', 'Simón Bolívar'],
  },
  {
    name: 'Imbabura',
    cantons: ['Antonio Ante', 'Cotacachi', 'Ibarra', 'Otavalo', 'Pimampiro', 'San Miguel de Urcuquí'],
  },
  {
    name: 'Loja',
    cantons: ['Calvas', 'Catamayo', 'Celica', 'Chaguarpamba', 'Espíndola', 'Gonzanamá', 'Loja', 'Macará', 'Olmedo', 'Paltas', 'Pindal', 'Puyango', 'Quilanga', 'Saraguro', 'Sozoranga', 'Zapotillo'],
  },
  {
    name: 'Los Ríos',
    cantons: ['Baba', 'Babahoyo', 'Buena Fe', 'Mocache', 'Montalvo', 'Palenque', 'Puebloviejo', 'Quevedo', 'Quinsaloma', 'Urdaneta', 'Valencia', 'Ventanas', 'Vinces'],
  },
  {
    name: 'Manabí',
    cantons: ['24 de Mayo', 'Bolívar', 'Chone', 'El Carmen', 'Flavio Alfaro', 'Jama', 'Jaramijó', 'Jipijapa', 'Junín', 'Manta', 'Montecristi', 'Olmedo', 'Paján', 'Pedernales', 'Pichincha', 'Portoviejo', 'Puerto López', 'Rocafuerte', 'San Vicente', 'Santa Ana', 'Sucre', 'Tosagua'],
  },
  {
    name: 'Morona Santiago',
    cantons: ['Gualaquiza', 'Huamboya', 'Limón Indanza', 'Logroño', 'Morona', 'Pablo Sexto', 'Palora', 'San Juan Bosco', 'Santiago', 'Sucúa', 'Taisha', 'Tiwintza'],
  },
  {
    name: 'Napo',
    cantons: ['Archidona', 'Carlos Julio Arosemena Tola', 'El Chaco', 'Quijos', 'Tena'],
  },
  {
    name: 'Orellana',
    cantons: ['Aguarico', 'La Joya de los Sachas', 'Loreto', 'Orellana'],
  },
  {
    name: 'Pastaza',
    cantons: ['Arajuno', 'Mera', 'Pastaza', 'Santa Clara'],
  },
  {
    name: 'Pichincha',
    cantons: ['Cayambe', 'Mejia', 'Pedro Moncayo', 'Pedro Vicente Maldonado', 'Puerto Quito', 'Quito', 'Rumiñahui', 'San Miguel de los Bancos'],
  },
  {
    name: 'Santa Elena',
    cantons: ['La Libertad', 'Salinas', 'Santa Elena'],
  },
  {
    name: 'Santo Domingo de los Tsáchilas',
    cantons: ['Santo Domingo'],
  },
  {
    name: 'Sucumbíos',
    cantons: ['Cascales', 'Cuyabeno', 'Gonzalo Pizarro', 'Lago Agrio', 'Putumayo', 'Shushufindi', 'Sucumbíos'],
  },
  {
    name: 'Tungurahua',
    cantons: ['Ambato', 'Baños de Agua Santa', 'Cevallos', 'Mocha', 'Patate', 'Quero', 'San Pedro de Pelileo', 'Santiago de Píllaro', 'Tisaleo'],
  },
  {
    name: 'Zamora Chinchipe',
    cantons: ['Centinela del Cóndor', 'Chinchipe', 'El Pangui', 'Nangaritza', 'Palanda', 'Paquisha', 'Yacuambi', 'Yantzaza (Yanzatza)', 'Zamora'],
  },
];

/** Nombres de provincia, para el primer selector. */
export const PROVINCE_NAMES: string[] = ECUADOR_PROVINCES.map((p) => p.name);

/** Cantones de una provincia; vacío si aún no eligieron provincia. */
export function cantonsOf(province: string): string[] {
  const found = ECUADOR_PROVINCES.find(
    (p) => p.name.toLowerCase() === province?.trim().toLowerCase(),
  );
  return found ? found.cantons : [];
}

/** Todos los cantones del país, ordenados: fallback cuando no hay provincia. */
export const ALL_CANTONS: string[] = [
  ...new Set(ECUADOR_PROVINCES.flatMap((p) => p.cantons)),
].sort((a, b) => a.localeCompare(b, 'es'));

