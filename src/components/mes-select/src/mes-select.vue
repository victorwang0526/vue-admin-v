<template>
    <el-select
        :value="value+''"
        :placeholder="placeholder"
        clearable
        @input="$emit('input', $event)">
        <el-option
            v-for="data in dataList"
            :key="data.dictValue"
            :label="data.dictLabel"
            :value="data.dictValue">
            {{ data.dictLabel }}
        </el-option>
    </el-select>
</template>
<script>
import { getDictDataList } from '@/utils';
export default {
    name: 'MesSelect',
    props: {
        value: [Number, String],
        dictType: String,
        placeholder: String
    },
    data() {
        return {
            dataList: getDictDataList(this.dictType)
        };
    }
};
</script>
