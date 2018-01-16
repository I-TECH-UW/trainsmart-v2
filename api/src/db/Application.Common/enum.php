<?php
/***An abstract enum template class
 * -includes Type Checking -> check if a variable is of a certain enum type
 * -verify that only allowed enum variables are being used
 * ***************************************
 * Limitations using this type of enum
 * ***************************************
 * 1 - First way of setting to TypeA
 * $myType = new MyEnum(MyEnum::TypeA);

 * 2 - Second way of setting to TypeA
 * $myType = new MyEnum(MyEnum::TypeC);
 * $myType->setValue(MyEnum::TypeA);

 * 3 - This way doesn't work at all though
 * $myType = MyEnum::TypeA;
 * ***************************************
 * Comparison
 * ***************************************
 * 4 - Works
 * $mytype->getValue()==MyEnum::TypeC
 * 5 - Doesn't work
 * $mytype==MyEnum::TypeC
 * 6 - Verify that variable is of enum type
 * $myType instanceof MyEnum
 * ***/
abstract class Enum{
	protected $value;
	
	/**
	 * Return value representation of this enum
	 *
	 * @return value
	 */
	public function getValue()
	{
		return $this->value;
	}
	
	/**
	 * Tries to set the value  of this enum
	 *
	 * @param $value
	 * @throws Exception If value is not part of this enum
	 */
	public function setValue($value)
	{
		if ($this->isValidEnumValue($value))
			$this->value = $value;
		else
			throw new Exception("Invalid enum type specified!");
	}
	
	/**
	 * Validates if the type given is part of this enum class
	 *
	 * @param $checkValue
	 * @return bool
	 */
	public function isValidEnumValue($checkValue)
	{
		$reflector = new ReflectionClass(get_class($this));
		foreach ($reflector->getConstants() as $validValue)
		{
			if ($validValue == $checkValue) return true;
		}
		return false;
	}
	
	/**
	 * @param $value Value for this display type
	 */
	function __construct($value)
	{
		$this->setValue($value);
	}
	
	/**
	 * With a magic getter you can get the value from this enum using
	 * any variable name as in:
	 *
	 * <code>
	 *   $myEnum = new MyEnum(MyEnum::start);
	 *   echo $myEnum->v;
	 * </code>
	 *
	 * @param $property
	 * @return $value
	 */
	function __get($property)
	{
		return $this->value;
	}
	
	/**
	 * With a magic setter you can set the enum value using any variable
	 * name as in:
	 *
	 * <code>
	 *   $myEnum = new MyEnum(MyEnum::Start);
	 *   $myEnum->v = MyEnum::End;
	 * </code>
	 *
	 * @param $property
	 * @param $value
	 * @throws Exception Throws exception if an invalid type is used
	 */
	function __set($property, $value)
	{
		$this->setValue($value);
	}
	
	/**
	 * If the enum is requested as a string then this function will be automatically
	 * called and the value of this enum will be returned as a string.
	 *
	 * @return string
	 */
	function __toString()
	{
		return (string)$this->value;
	}
}