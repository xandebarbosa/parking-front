import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

// Define os estilos usando uma API similar ao CSS-in-JS
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 30,
    color: "black",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingBottom: 10,
  },
  titleContainer: {
    textAlign: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "black",
    padding: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    width: "25%", // 4 colunas
    padding: 2,
  },
  gridItem2: {
    width: "50%", // 2 colunas
    padding: 2,
  },
  label: {
    fontSize: 8,
    color: "#333",
  },
  value: {
    borderWidth: 1,
    borderColor: "#555",
    padding: 4,
    fontSize: 10,
    fontWeight: "bold",
    minHeight: 20,
  },
});

interface RequisicaoPDFProps {
  efetivo: any;
  vehicle: any;
}

export default function RequisicaoPDF({
  efetivo,
  vehicle,
}: RequisicaoPDFProps) {
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={{ width: "25%" }}>
          POLÍCIA MILITAR DO ESTADO DE SÃO PAULO
        </Text>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>REQUISIÇÃO DE</Text>
          <Text style={styles.title}>CARTÃO DE ESTACIONAMENTO</Text>
        </View>
        <View style={{ width: "25%" }} />
      </View>

      <View style={styles.section}>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>POSTO/GRAD</Text>
            <Text style={styles.value}>{efetivo?.postoGrad}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>RE</Text>
            <Text style={styles.value}>{efetivo?.re}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>RG</Text>
            <Text style={styles.value}>{efetivo?.rg}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>NOME</Text>
            <Text style={styles.value}>{efetivo?.name}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>OPM</Text>
            <Text style={styles.value}>{efetivo?.opm}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>FUNÇÃO</Text>
            <Text style={styles.value}>{efetivo?.funcao}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>SEÇÃO</Text>
            <Text style={styles.value}>{efetivo?.secao}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>RAMAL</Text>
            <Text style={styles.value}>{efetivo?.ramal}</Text>
          </View>
          <View style={styles.gridItem2}>
            <Text style={styles.label}>PGU</Text>
            <Text style={styles.value}>{efetivo?.pgu}</Text>
          </View>
          <View style={styles.gridItem2}>
            <Text style={styles.label}>VAL. CNH</Text>
            <Text style={styles.value}>{efetivo?.valCnh}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DADOS DO PRIMEIRO VEÍCULO</Text>
        {/* Adicione os campos do veículo aqui seguindo o mesmo padrão */}
      </View>
    </Page>
  </Document>;
}
