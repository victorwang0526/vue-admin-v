<template>
    <el-radio-group
        :value="value+''"
        @input="$emit('input', $event)">
        <el-radio
            v-for="data in dataList"
            :key="data.dictValue"
            :label="data.dictValue">
            {{ data.dictLabel }}
        </el-radio>
    </el-radio-group>
</template>
<script>
import { getDictDataList } from '@/utils';
export default {
    name: 'MesRadioGroup',
    props: {
        value: [Number, String],
        dictType: String
    },
    data() {
        return {
            dataList: getDictDataList(this.dictType)
        };
    }
};
</script>
