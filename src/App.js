import React, { useState, useEffect } from "react";
import { Form, Select, Divider, Button, Spin } from "antd";
import { Column } from "@ant-design/charts";
import "./App.css";
import "antd/dist/antd.css";
import { records } from "./data";
import moment from "moment";

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
  const getDateValues = (date, days) => {
    let dateFrom = moment().subtract(days, "d").format("DD/MM/YYYY");
    let dateTo = moment().format("DD/MM/YYYY");
    let dateCheck = moment(date * 1000).format("DD/MM/YYYY");

    var d1 = dateFrom.split("/");
    var d2 = dateTo.split("/");
    var c = dateCheck.split("/");

    var from = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]);
    var to = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);
    var check = new Date(c[2], parseInt(c[1]) - 1, c[0]);

    return check > from && check < to;
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
        if (filterItem && filterValues.date) {
          // the available days range are 134 days to 142 days between
          filterItem = getDateValues(
            item.issue_created_at,
            parseInt(filterValues.date)
          );
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
        <Form.Item name="date">
          <Select className="select-style" defaultValue="SELECT" name="date">
            <Option value="134">Last 134 DAYS</Option>
            <Option value="136">Last 136 DAYS</Option>
            <Option value="140">Last 140 DAYS</Option>
            <Option value="180">Last 180 DAYS</Option>
            <Option value="360">LAST 365 DAYS</Option>
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
