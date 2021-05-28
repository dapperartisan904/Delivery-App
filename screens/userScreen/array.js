import React, { Component } from "react";
import { Text, StyleSheet, View, FlatList } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Col, Row, Grid } from "react-native-easy-grid";

const DATA = [
  {
    id: "1",
    name: "Jagan"
  },
  {
    id: "2",
    name: "Abhinav"
  },
  {
    id: "1",
    name: "Jagan"
  },
  {
    id: "2",
    name: "Abhinav"
  },
  {
    id: "1",
    name: "Jagan"
  },
  {
    id: "2",
    name: "Abhinav"
  },
  {
    id: "1",
    name: "Jagan"
  },
  {
    id: "2",
    name: "Abhinav"
  },
  {
    id: "1",
    name: "Jagan"
  },
  {
    id: "2",
    name: "Abhinav"
  },
  {
    id: "1",
    name: "Jagan"
  },
  {
    id: "2",
    name: "Abhinav"
  },
  {
    id: "1",
    name: "Jagan"
  },
  {
    id: "2",
    name: "Abhinav"
  },
  {
    id: "1",
    name: "Jagan"
  },
  {
    id: "2",
    name: "Abhinav"
  },
  {
    id: "1",
    name: "Jagan"
  },
  {
    id: "2",
    name: "Abhinav"
  },
  {
    id: "1",
    name: "Jagan"
  },
  {
    id: "2",
    name: "Abhinav"
  },
  {
    id: "1",
    name: "Jagan"
  },
  {
    id: "2",
    name: "Abhinav"
  },
  {
    id: "1",
    name: "Jagan"
  },
  {
    id: "2",
    name: "Abhinav"
  }
];
export default class array extends Component {
  static navigationOptions = {
    title: "FOOD COURT",
    headerStyle: {
      backgroundColor: "#fff"
    },

    headerTintColor: "#000",

    headerTitleStyle: {
      fontWeight: "bold"
    }
  };
  constructor(props) {
    super(props);

    this.state = {
      data: DATA
    };
  }
  render() {
    return (
      <ScrollView>
        <FlatList
          // horizontal
          // showsHorizontalScrollIndicator={false}
          data={this.state.data}
          renderItem={({ item: d }) => (
            <View>
              <Grid>
                <Col style={{ width: 270, height: 200 }}>
                  <Text>{d.name}</Text>
                </Col>
                <Col>
                  <Text>{d.name}</Text>
                  <Col>
                    <Text>{d.name}</Text>
                  </Col>
                </Col>
              </Grid>
            </View>
          )}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({});
