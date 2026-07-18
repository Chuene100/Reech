import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { Controller } from "react-hook-form";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  MaskSymbol,
  isLastFilledCell,
} from "react-native-confirmation-code-field";

//import custom
import { COLORS, SIZES } from "../../../constants";

const CELL_COUNT = 6;

const CustomInputUniqueCode = ({
  control,
  name,
  rules = {},
  keyboardType = "number-pad",
}) => {
  const [values, setValues] = useState("");
  const ref = useBlurOnFulfill({ values, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    values,
    setValues,
  });

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <>
          <View
            style={[
              styles.container,
              {
                backgroundColor: COLORS.black,
                borderColor: error ? COLORS.purple : "",
                padding: 8,
                marginVertical: 17,
              },
            ]}
          >
            <CodeField
              ref={ref}
              {...props}
              value={value} //{values}
              cellCount={CELL_COUNT}
              onChangeText={onChange} //{setValues}
              onBlur={onBlur}
              keyboardType={keyboardType}
              textContextType="oneTimeCode"
              maxLength={6}
              const
              renderCell={({ index, symbol, isFocused }) => {
                let textChild = null;
                if (symbol) {
                  textChild = (
                    <MaskSymbol
                      maskSymbol="*"
                      isLastFilledCell={isLastFilledCell({ index, values })}
                    >
                      {symbol}
                    </MaskSymbol>
                  );
                } else if (isFocused) {
                  textChild = <Cursor />;
                }

                return (
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler}
                  >
                    {textChild}
                  </Text>
                );
              }}
              style={styles.inputsUnique}
              enablesReturnKeyAutomatically
            />
          </View>
          {error && (
            <Text
              style={{
                color: COLORS.purple,
                alignSelf: "stretch",
                fontSize: SIZES.body5,
                padding: SIZES.padding - 22,
                marginTop: -5,
                marginBottom: 10,
                marginHorizontal: 12,
              }}
            >
              {error.message || "Oops, something went wrong!"}
            </Text>
          )}
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.black,
    width: "100%",
    height: 50,
    padding: 15,
    paddingLeft: -50,
    borderWidth: 1,
    marginVertical: 8,
  },
  inputsUnique: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 20,
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 32,
    fontSize: 24,
    borderWidth: 2,
    borderColor: COLORS.white,
    textAlign: "center",
    color: COLORS.white,
    marginTop: -4,
    marginLeft: 8,
  },
  focusCell: {
    borderColor: COLORS.white,
    color: COLORS.lightBlue,
  },
});

export default CustomInputUniqueCode;
