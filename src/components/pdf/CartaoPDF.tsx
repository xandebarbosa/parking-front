import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

// Registra a fonte Helvetica para garantir consistência na renderização do PDF
Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: "https://fonts.cdnfonts.com/s/13068/Helvetica.woff",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.cdnfonts.com/s/13068/Helvetica-Bold.woff",
      fontWeight: "bold",
    },
  ],
});

// Define todos os estilos necessários para o layout do cartão
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    padding: 10,
    backgroundColor: "white",
    flexDirection: "column",
  },
  cardBorder: {
    border: "2px solid black",
    padding: 5,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  headerLeft: {
    width: "35%",
    fontSize: 8,
    fontWeight: "bold",
  },
  headerRight: {
    width: "60%",
  },
  mainTitle: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    border: "1.5px solid black",
    padding: 2,
    marginBottom: 4,
  },
  infoBoxes: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoBox: {
    width: "48%",
    border: "1.5px solid black",
    padding: 2,
  },
  infoBoxLabel: {
    fontSize: 7,
    textAlign: "center",
    marginBottom: 1,
  },
  infoBoxValue: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  sectionTitle: {
    fontWeight: "bold",
    textAlign: "center",
    borderTop: "1.5px solid black",
    borderBottom: "1.5px solid black",
    paddingVertical: 1,
    marginVertical: 4,
    fontSize: 9,
  },
  dataRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  dataField: {
    border: "1.5px solid black",
    padding: 3,
    minHeight: 18,
    fontSize: 8,
    justifyContent: "center", // Centraliza verticalmente
  },
  label: {
    fontSize: 7,
    marginBottom: 1,
  },
  fieldGroup: {
    marginRight: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  footerSection: {
    marginTop: "auto", // Empurra esta seção para o final da página
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
  },
  footerBox: {
    border: "1.5px solid black",
    padding: 3,
    width: "49%",
  },
});

interface CartaoPDFProps {
  efetivo: any;
  vehicle: any;
}
//export default function Cartao({ efetivo, vehicle }: CartaoProps) {
export default function CartaoPDF({ efetivo, vehicle }: CartaoPDFProps) {
  // Funções para formatar os dados
  const formatCardNumber = (num: number) => String(num).padStart(4, "0");
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  return (
    <Document>
      {/* Define o tamanho da página para um cartão (aproximadamente 8.5x5.5 cm) */}
      <Page size={[240, 155]} style={styles.page}>
        <View style={styles.cardBorder}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text>POLÍCIA MILITAR</Text>
              <Text>DO ESTADO DE SÃO PAULO</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.mainTitle}>CARTÃO DE ESTACIONAMENTO</Text>
              <View style={styles.infoBoxes}>
                <View style={styles.infoBox}>
                  <Text style={styles.infoBoxLabel}>NÚMERO</Text>
                  <Text style={styles.infoBoxValue}>
                    {vehicle?.card_number
                      ? formatCardNumber(vehicle.card_number)
                      : ""}
                  </Text>
                </View>
                <View style={styles.infoBox}>
                  <Text style={styles.infoBoxLabel}>VALIDADE</Text>
                  <Text style={styles.infoBoxValue}>
                    {formatDate(vehicle?.validadeCartao)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>DADOS PESSOAIS</Text>
          <View style={styles.dataRow}>
            <View style={[styles.fieldGroup, { width: "25%" }]}>
              <Text style={styles.label}>POSTO/GRAD</Text>
              <Text style={[styles.dataField, styles.bold]}>
                {efetivo?.postoGrad || ""}
              </Text>
            </View>
            <View style={[styles.fieldGroup, { width: "75%" }]}>
              <Text style={styles.label}>NOME</Text>
              <Text style={[styles.dataField, styles.bold]}>
                {efetivo?.name || ""}
              </Text>
            </View>
          </View>
          <View style={styles.dataRow}>
            <View style={[styles.fieldGroup, { width: "50%" }]}>
              <Text style={styles.label}>RE</Text>
              <Text style={[styles.dataField, styles.bold]}>
                {efetivo?.re || ""}
              </Text>
            </View>
            <View style={[styles.fieldGroup, { width: "50%" }]}>
              <Text style={styles.label}>RG</Text>
              <Text style={[styles.dataField, styles.bold]}>
                {efetivo?.rg || ""}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>DADOS DOS VEÍCULOS</Text>
          <View style={styles.dataRow}>
            <View style={[styles.fieldGroup, { width: "25%" }]}>
              <Text style={styles.label}>PLACA</Text>
              <Text style={[styles.dataField, styles.bold]}>
                {vehicle?.placa || ""}
              </Text>
            </View>
            <View style={[styles.fieldGroup, { width: "25%" }]}>
              <Text style={styles.label}>CIDADE</Text>
              <Text style={[styles.dataField, styles.bold]}>
                {vehicle?.municipio || ""}
              </Text>
            </View>
            <View style={[styles.fieldGroup, { width: "25%" }]}>
              <Text style={styles.label}>UF</Text>
              <Text style={[styles.dataField, styles.bold]}>
                {vehicle?.uf || ""}
              </Text>
            </View>
            <View style={[styles.fieldGroup, { width: "25%" }]}>
              <Text style={styles.label}>COR</Text>
              <Text style={[styles.dataField, styles.bold]}>
                {vehicle?.color || ""}
              </Text>
            </View>
          </View>

          <View style={styles.footerSection}>
            <View style={styles.footerBox}>
              <Text>Período Solicitado</Text>
              <Text style={styles.bold}>
                {vehicle?.periodo1Entrada} às {vehicle?.periodo1Saida}
              </Text>
              {vehicle?.periodo2Entrada && (
                <Text style={styles.bold}>
                  {vehicle?.periodo2Entrada} às {vehicle?.periodo2Saida}
                </Text>
              )}
            </View>
            <View style={styles.footerBox}>
              <Text>Emitido em</Text>
              <Text style={styles.bold}>
                {formatDate(new Date().toISOString())}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
