const graphql = require("graphql");

const {
  GraphQLObjectType, GraphQLString, GraphQLSchema,
  GraphQLID, GraphQLInt, GraphQLList,
} = graphql;

const Movies = require("../models/movie");
const Directors = require("../models/director");

// const movieJson = {
// { "name": "Pulp Fiction", "genre": "Crime", "directorId": },
// { "name": "1984", "genre": "Sci-Fi", "directorId": "5d3be0d27c213e1b35df46fc"},
// { "name": "V for vendetta", "genre": "Sci-Fi-Triller", "directorId": "5d3be1007c213e1b35df46fd" },
// { "name": "Snatch", "genre": "Crime-Comedy", "directorId": "5d3be1267c213e1b35df4700" },
// { "name": "Reservoir Dogs", "genre": "Crime", "directorId": "5d3bdd837c213e1b35df46c0"},
// { "name": "The Hateful Eight", "genre": "Crime", "directorId": "5d3bdd837c213e1b35df46c0"},
// { "name": "Inglourious Basterds", "genre": "Crime", "directorId": "5d3bdd837c213e1b35df46c0"},
// { "name": "Lock, Stock and Two Smoking Barrels", "genre": "Crime-Comedy", "directorId": "5d3be1267c213e1b35df4700"},
// }

// const directorsJson = {
// { "name": "Quentin Tarantino", "age": 55 }, // "5d3bdd837c213e1b35df46c0"
// { "name": "Michael Radford", "age": 72 }, // "5d3be0d27c213e1b35df46fc"
// { "name": "James McTeigue", "age": 51 }, // "5d3be1007c213e1b35df46fd"
// { "name": "Guy Ritchie", "age": 50 }, // "5d3be1267c213e1b35df4700"
// }

const movies = [
  { id: "1", name: "Pulp Fiction", genre: "Crime", directorId: "1" },
  { id: "2", name: "1984", genre: "Sci-Fi", directorId: "2" },
  { id: 3, name: "V for vendetta", genre: "Sci-Fi-Triller", directorId: "3" },
  { id: 4, name: "Snatch", genre: "Crime-Comedy", directorId: "4" },
  { id: "5", name: "Reservoir Dogs", genre: "Crime", directorId: "1" },
  { id: "6", name: "The Hateful Eight", genre: "Crime", directorId: "1" },
  { id: "7", name: "Inglourious Basterds", genre: "Crime", directorId: "1" },
  { id: "7", name: "Lock, Stock and Two Smoking Barrels", genre: "Crime-Comedy", directorId: "4" },
];

const directors = [
  { id: "1", name: "Quentin Tarantino", age: 55 },
  { id: "2", name: "Michael Radford", age: 72 },
  { id: "3", name: "James McTeigue", age: 51 },
  { id: "4", name: "Guy Ritchie", age: 50 },
];


const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    director: {
      type: DirectorType,
      resolve(parent, args) {
        // return directors.find(director => director.id == parent.id);
        return Directors.findById(parent.directorId);
      },
    },
  }),
});

const DirectorType = new GraphQLObjectType({
  name: "Director",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        // return movies.filter(movie => movie.directorId == parent.id);
        return Movies.find({ directorId: parent.id });
      },
    },
  }),
});

// mutation($name: String, $age: Int){
//   addDirector(name: $name, age: $age){
//     name
//     age
//   }
// }
// {
//   "name": "Test",
//   "age": 21
// }

// mutation($id: ID){
//   deleteDirector(id: $id){
//     name
//   }
// }
//
// {
//   "id": "5d4365c5ba28052afc85d4d9"
// }
//

// mutation($id: ID, $name: String, $age: Int){
//   updateDirector(id: $id, name: $name, age: $age){
//     name
//   }
// }
//
// {
//   "id": "5d3be1267c213e1b35df4700",
//   "name":  "Guy_ Ritchie",
//   "age": 51
// }

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addDirector: {
      type: DirectorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        const director = new Directors({
          name: args.name,
          age: args.age,
        });
        return director.save();
      },
    },
    addMovie: {
      type: MovieType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        directorId: { type: GraphQLID },
      },
      resolve(parent, args) {
        const movie = new Movies({
          name: args.name,
          genre: args.genre,
          directorId: args.directorId,
        });
        return movie.save();
      },
    },
    deleteDirector: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Directors.findByIdAndRemove(args.id);
      },
    },
    deleteMovie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Movies.findByIdAndRemove(args.id);
      },
    },
    updateDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        return Directors.findByIdAndUpdate(
          args.id,
          { $set: { name: args.name, age: args.age } },
          { new: true },
        );
      },
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        directorId: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Movies.findByIdAndUpdate(
          args.id,
          { $set: { name: args.name, genre: args.genre, directorId: args.directorId } },
          { new: true },
        );
      },
    },
  },
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return movies.find(movie => movie.id == args.id);
        return Movies.findById(args.id);
      },
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return directors.find(director => director.id == args.id);
        return Directors.findById(args.id);

      },
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        // return movies;
        return Movies.find({});
      },
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve(parent, args) {
        // return directors;
        return Directors.find({});
      },
    },
  },
});

// query{
//   movies{
//     name,
//       genre
//   }
// }

// query($id: ID){
//   director(id: $id){
//     id
//     name
//     movies{
//       name
//     }
//   }
// }

// {
//   "id": 2
// }

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});