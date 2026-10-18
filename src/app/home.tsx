import {
    View,
    Text,
    StyleSheet
} from 'react-native';

export default function HomeScreen(){
    return(
        <View style={styles.Main}>
            <Text style={styles.InviteMess}>Welcome to <Text style={{color:'gold'}}>HOME</Text> Page</Text>
        </View>
    )
}

const styles=StyleSheet.create({
Main:{
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
},
InviteMess:{
    padding:10,
    fontSize:28,
    fontWeight:900

}
})