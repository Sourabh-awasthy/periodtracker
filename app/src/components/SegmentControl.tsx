import React from 'react'
import { StyleSheet, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Button } from './Button'
import { ErrorText } from './ErrorText'
import { Text } from './Text'

interface SegmentControlOption {
  value: string
  label: string
  iconName: string
}

interface SegmentControlProps {
  label?: string
  selected: string
  options: SegmentControlOption[]
  onSelect: (value: string) => void
  errors?: string[]
  errorKey?: string
  errorsVisible?: boolean
}

export const SegmentControl = ({
  label,
  selected,
  options,
  onSelect,
  errors,
  errorKey,
  errorsVisible,
}: SegmentControlProps) => {
  const hasError = errorsVisible && errorKey && errors && errors.includes(errorKey)

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.container}>
        {hasError && <ErrorText>{errorKey}</ErrorText>}

        {options.map((option) => {
          const isSelected = selected === option.value
          const onPress = () => onSelect(option.value)

          return (
            <View key={`segment-${option.value}`} style={styles.option}>
              <Button
                status={isSelected ? 'primary' : 'basic'}
                style={styles.iconContainer}
                onPress={onPress}
              >
                <FontAwesome
                  size={20}
                  // @ts-expect-error TODO:
                  name={option.iconName}
                  color={'#fff'}
                />
              </Button>
              <Text enableTranslate={true} style={styles.optionText}>
                {option.label}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 4,
  },
  label: {
    color: '#28b9cb',
  },
  option: {
    flexDirection: 'column',
    alignItems: 'center',
    margin: 4,
  },
  optionText: {
    fontSize: 10,
    textAlign: 'center',
    width: 80,
  },
  iconContainer: {
    width: 40,
    height: 40,
    margin: 4,
  },
})
