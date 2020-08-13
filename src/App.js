import React, {useState, useEffect} from "react";

import {
  TextInput,
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from './services/api';

export default function App() {
  const [repositories, setRepositories] = useState([]);
  const [newTech, setNewTech] = useState('');

  useEffect(() => {
    api.get('repositories').then(response => {
        setRepositories(response.data);
    });
  }, []);

  async function handleAddRepository() {
    // if (newTech) {
      const response = await api.post('repositories', {
        url: "new-list",
        title: newTech,
        techs: [
          "React Native",
          "React",
          "Node",
          "Adonis"
        ]
      });
  
      const repository = response.data;
  
      setRepositories([...repositories, repository]);
      setNewTech('');
    // } else {
    //   Alert.alert('Erro','Adicione um titulo!');
    // }
  }


  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);

    const newRepositories = repositories.map((repository) =>
      repository.id !== id ? repository : response.data
    );

    setRepositories(newRepositories);
  }


  async function handleRemoveRepository(id) {
    const repositoriesListCopy = repositories.filter(repository => repository.id !== id);
    
    await api.delete(`repositories/${id}`);
    
    setRepositories(repositoriesListCopy);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <View style={styles.head}>
          <TextInput style={styles.input} onChangeText={text => setNewTech(text)} placeholder="Nome do Projeto" />
          <TouchableOpacity
            style={styles.buttonAdd}
            onPress={() => handleAddRepository()}
          >
            <Text style={styles.buttonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({item: repository}) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>

              <View style={styles.techsContainer}>
              {repository.techs[3] ?
                  <Text style={styles.tech}>
                    {repository.techs[0]}
                  </Text> : ''
                }
                {repository.techs[3] ?
                  <Text style={styles.tech}>
                    {repository.techs[1]}
                  </Text> : ''
                }
                {repository.techs[3] ?
                  <Text style={styles.tech}>
                    {repository.techs[2]}
                  </Text> : ''
                }
                {repository.techs[3] ?
                  <Text style={styles.tech}>
                    {repository.techs[3]}
                  </Text> : ''
                }
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repository.id}`}
                >
                  {repository.likes} curtidas
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(repository.id)}
                  testID={`like-button-${repository.id}`}
                >
                  <Text style={styles.buttonText}>Curtir</Text>
                </TouchableOpacity>
              </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleRemoveRepository(repository.id)}
                >
                  <Text style={styles.buttonText}>Remover</Text>
                </TouchableOpacity>
            </View>
          )}
        />  
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  head: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 4,
    margin: 15,
    paddingLeft: 20,
    flex: 1,
  },
  buttonAdd: {
    
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 4,
    elevation: 10,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "#5C42B3",
    padding: 15,
    color: "#fff",
    marginRight: 10,
    marginTop: 10,
  },
  button: {
    marginTop: 10,
    borderRadius: 4,
    flex: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});