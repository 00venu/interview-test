import React, { useState, useEffect } from "react";
import { Form, Select, Divider, Button, Spin } from "antd";
import { Column } from "@ant-design/charts";
import "./App.css";
import "antd/dist/antd.css";
import { records } from "./data";

const { Option } = Select;
function App() {
  const [finalData, setFinalData] = useState(records);
  const [filterValues, setFilterValues] = useState({});
  const [config, setConfig] = useState();
  const [loadingSpin, setLoadingSpin] = useState(false);

  useEffect(() => {
    const getValues = (value) => {
      return finalData.map((item) => item[value]);
    };
    let assignee = getValues("assignee");
    const counts = {};
    assignee.forEach((x) => {
      counts[x] = (counts[x] || 0) + 1;
    });
    assignee = [...new Set(assignee)];
    let data = assignee.map((item) => {
      return {
        assignee: item,
        tickets: counts[item],
      };
    });
    var config1 = {
      data: data,
      xField: "assignee",
      yField: "tickets",
      label: {
        position: "middle",
        style: {
          fill: "#FFFFFF",
          opacity: 0.6,
        },
      },
      xAxis: {
        label: {
          autoHide: false,
          autoRotate: true,
        },
      },
    };
    setConfig(config1);
  }, [finalData]);

  const getStandardValues = (value) => {
    return records.map((item) => item[value]);
  };
  const status = [...new Set(getStandardValues("status"))];
  const type = [...new Set(getStandardValues("issue_type"))];
  const priority = [...new Set(getStandardValues("priority"))];

  useEffect(() => {
    const keys = Object.keys(filterValues);
    if (keys.length) {
      const data = records.filter((item) => {
        let filterItem = true;
        if (filterItem && filterValues.status) {
          filterItem = item.status === filterValues.status;
        }
        if (filterItem && filterValues.type) {
          filterItem = item.issue_type === filterValues.type;
        }
        if (filterItem && filterValues.priority) {
          filterItem = item.priority === filterValues.priority;
        }
        return filterItem;
      });
      setFinalData(data);
    }
  }, [filterValues]);

  const onFinish = (values) => {
    setLoadingSpin(true);
    setFilterValues(values);
    setTimeout(() => {
      setLoadingSpin(false);
    }, 500);
  };
  let dataLoading;
  if (finalData.length && config) {
    dataLoading = <Column {...config} />;
  } else {
    dataLoading = <div className="no-data">NO DATA IN FILTER CRITERIA.</div>;
  }

  return (
    <div className="App">
      <Form layout="inline" onFinish={onFinish}>
        <Form.Item name="status">
          <Select className="select-style" defaultValue="SELECT" name="status">
            {status.map((item) => (
              <Option value={item} key={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="type">
          <Select className="select-style" defaultValue="SELECT" name="type">
            {type.map((item) => (
              <Option value={item} key={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="priority">
          <Select
            className="select-style"
            defaultValue="SELECT"
            name="priority"
          >
            {priority.map((item) => (
              <Option value={item} key={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            APPLY
          </Button>
        </Form.Item>
      </Form>
      <Divider />
      {loadingSpin ? (
        <div className="spin-data">
          <Spin loading={true} />
        </div>
      ) : (
        dataLoading
      )}
    </div>
  );
}

export default App;
