import CheckTable from "./components/CheckTable";

import {
  columnsDataDevelopment,
  columnsDataCheck,
  columnsDataColumns,
  columnsDataComplex,
} from "./variables/columnsData";
import tableDataDevelopment from "./variables/tableDataDevelopment.json";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataColumns from "./variables/tableDataColumns.json";
import tableDataComplex from "./variables/tableDataComplex.json";
import DevelopmentTable from "./components/DevelopmentTable";
import DevelopmentTable2 from "./components/DevelopmentTable2";
import ColumnsTable from "./components/ColumnsTable";
import ComplexTable from "./components/ComplexTable";

const Tables = () => {
  return (
    <div>
      <div>
        <DevelopmentTable2
          columnsData={columnsDataDevelopment}
          tableData={tableDataDevelopment}
        />
      </div>

      
    </div>
  );
};

export default Tables;
