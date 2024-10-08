import React from 'react'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Modal, ModalProps } from '../../components/Modal'
import { Hr } from '../../components/Hr'
import { Text } from '../../components/Text'
import { Input } from '../../components/Input'
import { useSelector } from '../../redux/useSelector'
import { currentUserSelector } from '../../redux/selectors'
import { User } from '../../redux/reducers/authReducer'
import { httpClient } from '../../services/HttpClient'
import { useDispatch } from 'react-redux'
import { editUser } from '../../redux/actions'
import { formatPassword } from '../../services/auth'
import { useTranslate } from '../../hooks/useTranslate'
import useAlert from "../../hooks/useAlert"

export const EditPasswordModal = ({ visible, toggleVisible }: ModalProps) => {
  const translate = useTranslate()
  const currentUser = useSelector(currentUserSelector) as User
  const name = currentUser.name
  const reduxDispatch = useDispatch()

  const [secret, setSecret] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [errorsVisible, setErrorsVisible] = React.useState(false)

  const formattedPassword = formatPassword(newPassword)
  const formattedSecret = formatPassword(secret)

  const { isValid, errors } = validate(formattedPassword)
  const { successAlert, failAlert } = useAlert();

  const sendRequest = async (password: string, secretAnswer: string) => {
    await httpClient.resetPassword({
      name,
      secretAnswer,
      password,
    })
  }

  const updateReduxState = (password: string) => {
    reduxDispatch(editUser({ password }))
  }

  const onConfirm = async () => {
    setErrorsVisible(true)

    if (!isValid) {
      return
    }

    try {
      await sendRequest(formattedPassword, formattedSecret)
      updateReduxState(formattedPassword)
      toggleVisible()
      successAlert('success','forgot_password_completed')
    } catch (error) {
      failAlert('unsuccessful','password_change_fail_description')
    }
  }

  // Reset
  React.useEffect(() => {
    setSecret('')
    setNewPassword('')
    setErrorsVisible(false)
  }, [currentUser])

  return (
    <Modal visible={visible} toggleVisible={toggleVisible} style={styles.modal}>
      <View style={styles.modalBody}>
        <Input
          value={secret}
          onChangeText={setSecret}
          placeholder="secret_answer"
          secureTextEntry={true}
        />
        <Input
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="password"
          secureTextEntry={true}
          errors={errors}
          errorKeys={['password_too_short']}
          errorsVisible={errorsVisible}
        />
      </View>
      <Hr />
      <TouchableOpacity onPress={onConfirm} style={styles.modalConfirm}>
        <Text style={styles.modalConfirmText}>confirm</Text>
      </TouchableOpacity>
    </Modal>
  )
}

const validate = (password: string) => {
  const errors: string[] = []
  let isValid = true

  if (password.length < 3) {
    isValid = false
    errors.push('password_too_short')
  }

  return { isValid, errors }
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  modalBody: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalConfirm: {
    padding: 24,
  },
  modalConfirmText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
})
