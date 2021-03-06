// @flow

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { BlurView } from '@react-native-community/blur';
import { connection_levels } from '@/utils/constants';
import { DEVICE_LARGE } from '@/utils/deviceConstants';
import { useDispatch, useSelector } from 'react-redux';
import api from '@/api/brightId';
import { setConnectionLevel } from '@/actions/connections';
import TrustlevelSlider from './TrustlevelSlider';

type props = {
  route: any,
  navigation: any,
};

const TrustlevelModal = ({ route, navigation }: props) => {
  const { connectionId } = route.params;
  const myId = useSelector((state) => state.user.id);
  const connection: connection = useSelector((state: State) =>
    state.connections.connections.find((conn) => conn.id === connectionId),
  );
  const dispatch = useDispatch();
  const [level, setLevel] = useState(
    connection ? connection.level : connection_levels.JUST_MET,
  );
  const { t } = useTranslation();

  const saveLevelHandler = async () => {
    if (connection.level !== level) {
      console.log(`Setting connection level '${level}' for ${connection.name}`);
      await api.addConnection(
        myId,
        connection.id,
        level,
        undefined,
        Date.now(),
      );
      dispatch(setConnectionLevel(connection.id, level));
    }
    // close modal
    navigation.goBack();
  };

  // go back silently if connection does not exist. Should never happen.
  if (!connection) {
    console.log(`ConnectionID ${connectionId} not found!`);
    navigation.goBack();
    return null;
  }

  const changeLevelHandler = (newLevel: ConnectionLevel) => {
    setLevel(newLevel);
  };

  return (
    <View style={styles.container}>
      <BlurView
        style={styles.blurView}
        blurType="dark"
        blurAmount={5}
        reducedTransparencyFallbackColor="black"
      />
      <TouchableWithoutFeedback onPress={navigation.goBack}>
        <View style={styles.blurView} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {t('connectionDetails.text.level', {name: connection.name})}
          </Text>
        </View>
        <TrustlevelSlider
          currentLevel={level}
          changeLevelHandler={changeLevelHandler}
        />
        <TouchableOpacity
          testID="SaveLevelBtn"
          style={styles.confirmButton}
          onPress={saveLevelHandler}
        >
          <Text style={styles.confirmButtonText}>{t('connectionDetails.button.levelSave')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 25,
    padding: DEVICE_LARGE ? 30 : 25,
  },
  header: {
    marginTop: 5,
    marginBottom: DEVICE_LARGE ? 22 : 20,
  },
  headerText: {
    fontFamily: 'Poppins-Bold',
    fontSize: DEVICE_LARGE ? 19 : 16.5,
    textAlign: 'center',
  },
  confirmButton: {
    width: '90%',
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 10,
    backgroundColor: '#5DEC9A',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  confirmButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: DEVICE_LARGE ? 17 : 15,
  },
});

export default TrustlevelModal;
